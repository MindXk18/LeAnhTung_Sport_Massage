# Sport Massage — Booking + E-learning MVP
## Tài liệu tổng hợp: Context / Kiến trúc / Roadmap / Implementation Plan chi tiết

---

## 1. Bối cảnh dự án

Dự án nhỏ, làm cùng bạn trong lĩnh vực Sport Massage. Mục tiêu xây một **website tích hợp 2 tính năng chính**:

1. **Booking** — khách đặt lịch trị liệu (massage thể thao, phục hồi chấn thương, deep tissue...)
2. **E-learning** — thư viện video hướng dẫn tự tập/stretching tại nhà, dành cho **khách hàng cuối** (không phải đào tạo KTV)

Đây là bản **MVP demo**: mục tiêu là chứng minh ý tưởng, đủ để pitch/demo cho đối tác, không cần hạ tầng backend nặng ở giai đoạn đầu.

### Nguyên tắc thiết kế xuyên suốt
- **Nhanh > hoàn hảo**: build đủ dùng, không over-engineer.
- **Không cần auth phức tạp**: khách đặt lịch không cần tài khoản; admin chỉ cần 1 lớp bảo vệ đơn giản.
- **Data nhẹ nhưng persistent thật** trên production (khác với JSON file tĩnh, vì Vercel không cho ghi file persistent).
- **Kết nối 2 module là điểm bán hàng cốt lõi**: "đến trị liệu + có bài tập về nhà đi kèm" — không phải 2 tính năng rời rạc.

### Quyết định đã chốt
| Chủ đề | Quyết định |
|---|---|
| Đối tượng e-learning | Khách hàng cuối — thư viện video tự tập theo **nhóm vấn đề** (đau lưng, đau gối, căng vai gáy...), không phải khóa học tuần tự có quiz/chứng chỉ |
| Nơi deploy | Vercel |
| Lưu trữ dữ liệu | Không ghi file JSON trực tiếp (vì Vercel serverless filesystem không persistent) → dùng Vercel KV / Upstash Redis (free tier) |
| Quản trị booking | Bạn vận hành sport massage tự đăng nhập trang `/admin` để xem & duyệt lịch — không cần kênh thông báo Zalo/email ở MVP |
| Thanh toán | Không cần online ở MVP — "thanh toán tại chỗ" |
| Auth khách hàng | Không cần — chỉ nhập tên/SĐT khi đặt lịch |

---

## 2. Tech Stack chi tiết

| Thành phần | Lựa chọn | Ghi chú |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server Components cho trang list, Client Components cho form tương tác |
| Ngôn ngữ | TypeScript | Giúp định nghĩa rõ schema data ngay từ đầu, tránh lỗi khi thao tác JSON |
| Styling | Tailwind CSS | Dev nhanh, dễ polish UI cho demo |
| Data storage | Vercel KV (Upstash Redis dưới nền) | Lưu mỗi collection dưới dạng 1 key chứa JSON array (đơn giản hóa, không cần Redis hash/set phức tạp cho MVP) |
| Video hosting | YouTube (unlisted) embed | Không tốn chi phí/hạ tầng hosting video |
| Deploy | Vercel | Free tier đủ dùng cho demo |
| Admin auth | Middleware kiểm tra cookie/session đơn giản, password qua biến môi trường | Không cần NextAuth/hệ thống user role ở MVP — có thể nâng cấp sau |
| Form validation | Zod (kết hợp React Hook Form nếu cần) | Đảm bảo dữ liệu ghi vào KV luôn đúng shape |

### Cấu trúc thư mục đề xuất

```
sport-massage-app/
├── app/
│   ├── page.tsx                        // Landing page
│   ├── booking/
│   │   ├── page.tsx                    // Form đặt lịch
│   │   └── confirm/page.tsx            // Trang xác nhận + gợi ý program
│   ├── programs/
│   │   ├── page.tsx                    // Danh sách chương trình tập
│   │   └── [slug]/page.tsx             // Chi tiết chương trình + video
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── bookings/page.tsx           // Danh sách + duyệt lịch
│   └── api/
│       ├── bookings/
│       │   ├── route.ts                // GET (list), POST (tạo booking)
│       │   └── [id]/route.ts           // PATCH (đổi trạng thái)
│       ├── availability/route.ts       // GET khung giờ trống theo therapist/ngày
│       ├── services/route.ts           // GET danh sách dịch vụ
│       ├── therapists/route.ts         // GET danh sách KTV
│       ├── programs/route.ts           // GET danh sách chương trình tập
│       └── auth/
│           └── login/route.ts          // POST xác thực admin
├── lib/
│   ├── kv.ts                           // Wrapper các hàm đọc/ghi Vercel KV
│   ├── types.ts                        // Định nghĩa TypeScript types/interfaces
│   ├── schemas.ts                      // Zod schemas validate input
│   └── seed-data.ts                    // Data mẫu để seed ban đầu
├── components/
│   ├── booking/
│   │   ├── ServiceSelector.tsx
│   │   ├── TherapistSelector.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   └── BookingForm.tsx
│   ├── programs/
│   │   ├── ProgramCard.tsx
│   │   └── VideoEmbed.tsx
│   ├── admin/
│   │   ├── BookingTable.tsx
│   │   └── StatusBadge.tsx
│   └── shared/
│       ├── Header.tsx
│       └── Footer.tsx
├── middleware.ts                       // Bảo vệ route /admin/*
└── scripts/
    └── seed.ts                         // Script chạy 1 lần để seed data vào KV
```

---

## 3. Data Schema chi tiết

### 3.1. `therapists` (KV key: `therapists`)

```ts
interface Therapist {
  id: string;              // "th_001"
  name: string;
  avatarUrl?: string;
  bio?: string;
  specialties: string[];   // ["sport", "recovery", "deep-tissue"]
  workingHours: {
    // theo thứ trong tuần, đơn giản hóa: cố định theo tuần cho MVP
    dayOfWeek: number;      // 0 = CN, 1 = T2, ...
    startTime: string;      // "09:00"
    endTime: string;        // "18:00"
  }[];
  isActive: boolean;
}
```

### 3.2. `services` (KV key: `services`)

```ts
interface Service {
  id: string;               // "sv_001"
  name: string;              // "Trị liệu đau vai gáy"
  description: string;
  durationMinutes: number;   // 60
  price: number;              // VNĐ
  issueTags: string[];        // ["vai-gay"] — dùng để match với programs
  isActive: boolean;
}
```

### 3.3. `bookings` (KV key: `bookings`)

```ts
interface Booking {
  id: string;                 // "bk_20260812_001"
  serviceId: string;
  therapistId: string;
  customerName: string;
  customerPhone: string;
  date: string;                // "2026-08-15"
  startTime: string;            // "14:00"
  endTime: string;               // tính từ service.durationMinutes
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;             // ISO timestamp
  note?: string;
}
```

### 3.4. `programs` (KV key: `programs`) — thay cho khái niệm "khóa học"

```ts
interface Program {
  id: string;                  // "pg_001"
  slug: string;                 // "dau-vai-gay"
  title: string;                 // "Bài tập giảm đau vai gáy tại nhà"
  description: string;
  issueTags: string[];           // ["vai-gay"] — match với service.issueTags
  thumbnailUrl?: string;
  lessons: string[];              // array of lesson ids thuộc program này
}
```

### 3.5. `lessons` (KV key: `lessons`)

```ts
interface Lesson {
  id: string;                  // "ls_001"
  programId: string;
  title: string;
  youtubeVideoId: string;       // chỉ lưu ID, không lưu full URL
  durationMinutes?: number;
  order: number;                 // thứ tự hiển thị trong program (không bắt buộc xem tuần tự)
}
```

### 3.6. Ghi chú về việc dùng Vercel KV

- Mỗi collection ở trên lưu dưới dạng **1 key duy nhất chứa toàn bộ array JSON** (VD: key `bookings` → `JSON.stringify(Booking[])`). Với quy mô demo (vài chục bản ghi), cách này đơn giản hơn nhiều so với dùng Redis hash/set cho từng record, và code đọc/ghi gần như y hệt logic thao tác JSON file ban đầu — chỉ đổi `fs.readFile` → `kv.get()`.
- Khi ghi (VD: thêm booking mới): đọc toàn bộ array → push phần tử mới → `kv.set()` lại toàn bộ. Với quy mô MVP, hiệu năng không phải vấn đề.
- Nếu sau này data lớn hơn, có thể migrate sang lưu từng record theo key riêng (`booking:bk_001`) + 1 key index — nhưng **không cần thiết ở giai đoạn MVP**.

---

## 4. Chi tiết từng trang & luồng người dùng

### 4.1. Landing page (`/`)
- Hero section giới thiệu dịch vụ + CTA "Đặt lịch ngay"
- Section preview 3-4 dịch vụ nổi bật (lấy từ `services`)
- Section preview chương trình tập phổ biến (lấy từ `programs`) — gợi ý cross-sell ngay từ đầu
- Footer: thông tin liên hệ

### 4.2. Trang Booking (`/booking`)
**Luồng 4 bước (có thể làm dạng stepper hoặc 1 trang cuộn dài cho MVP — khuyến nghị stepper để rõ ràng khi demo):**

1. **Chọn dịch vụ** — hiển thị card từng service (tên, mô tả, giá, thời lượng). Chọn xong → hiển thị luôn `issueTags` liên quan (ẩn, dùng cho bước gợi ý program sau).
2. **Chọn KTV** — danh sách therapist có `specialties` phù hợp với service đã chọn, hoặc option "Bất kỳ, hệ thống tự chọn".
3. **Chọn khung giờ** — gọi API `/api/availability?therapistId=...&date=...` để lấy danh sách khung giờ trống. Logic: lấy `workingHours` của therapist theo `dayOfWeek`, trừ đi các khoảng đã có trong `bookings` (status khác "cancelled") của therapist đó trong ngày, chia theo block bằng `durationMinutes` của service.
4. **Xác nhận** — form nhập `customerName`, `customerPhone`, note (tuỳ chọn). Submit → gọi API POST `/api/bookings` → tạo booking với status mặc định `"pending"`.

Sau khi submit thành công → redirect sang `/booking/confirm?id=bk_xxx`.

### 4.3. Trang xác nhận (`/booking/confirm`)
- Hiển thị mã đặt lịch, thông tin tóm tắt (dịch vụ, KTV, ngày giờ)
- Trạng thái: "Đang chờ xác nhận từ phòng khám"
- **Section gợi ý program**: query `programs` theo `issueTags` trùng với `issueTags` của service vừa đặt → hiển thị 1-2 program liên quan kèm CTA "Xem bài tập bổ trợ tại nhà"

### 4.4. Trang danh sách chương trình (`/programs`)
- Grid card các program (thumbnail, title, số lượng lesson)
- Có thể filter theo `issueTags` (dropdown/tag chips) — không bắt buộc cho MVP nhưng dễ làm nếu còn thời gian

### 4.5. Trang chi tiết chương trình (`/programs/[slug]`)
- Thông tin program (title, description)
- Danh sách lessons dạng list, click vào từng lesson → hiển thị video embed YouTube ngay trên trang (không cần điều hướng tuần tự, khách xem lesson nào tuỳ ý)

### 4.6. Trang Admin — Login (`/admin/login`)
- Form nhập password đơn giản → so sánh với biến môi trường `ADMIN_PASSWORD`
- Thành công → set cookie session (HttpOnly, có thời hạn, VD 7 ngày) → redirect `/admin/bookings`
- `middleware.ts` kiểm tra cookie này cho mọi route `/admin/*` (trừ `/admin/login`)

### 4.7. Trang Admin — Quản lý booking (`/admin/bookings`)
- Bảng danh sách toàn bộ booking, sort theo ngày gần nhất
- Filter theo trạng thái (tất cả / chờ xác nhận / đã xác nhận / hoàn thành / huỷ) và theo ngày
- Mỗi dòng: thông tin khách, dịch vụ, KTV, giờ, trạng thái, nút hành động đổi trạng thái (dropdown hoặc nút nhanh "Xác nhận" / "Huỷ" / "Hoàn thành")
- Đổi trạng thái → gọi API PATCH `/api/bookings/[id]`, cập nhật UI ngay (optimistic update hoặc refetch)

---

## 5. API Routes chi tiết

| Method | Endpoint | Mô tả | Input | Output |
|---|---|---|---|---|
| GET | `/api/services` | Lấy danh sách dịch vụ active | — | `Service[]` |
| GET | `/api/therapists` | Lấy danh sách KTV, có thể filter theo specialty | `?specialty=` | `Therapist[]` |
| GET | `/api/availability` | Lấy khung giờ trống | `?therapistId=&date=&serviceId=` | `string[]` (VD `["09:00","10:00",...]`) |
| POST | `/api/bookings` | Tạo booking mới | `{serviceId, therapistId, date, startTime, customerName, customerPhone, note?}` | `Booking` (status `pending`) |
| GET | `/api/bookings` | Lấy danh sách booking (dùng cho admin) | `?status=&date=` | `Booking[]` |
| PATCH | `/api/bookings/[id]` | Đổi trạng thái booking | `{status}` | `Booking` đã cập nhật |
| GET | `/api/programs` | Lấy danh sách program, kèm lessons | `?issueTag=` | `Program[]` (embed lessons hoặc trả riêng) |
| POST | `/api/auth/login` | Xác thực admin | `{password}` | Set cookie, `{success: boolean}` |

Tất cả input đều validate qua Zod schema trong `lib/schemas.ts` trước khi ghi vào KV, tránh data rác làm hỏng demo.

---

## 6. Roadmap chi tiết theo giai đoạn

### Giai đoạn 0 — Setup nền tảng (khoảng 0.5-1 ngày)
- [ ] Khởi tạo Next.js project (App Router, TypeScript, Tailwind)
- [ ] Đăng ký Vercel KV / Upstash, lấy connection string, setup biến môi trường (`.env.local` + Vercel dashboard)
- [ ] Viết `lib/kv.ts` — các hàm `getCollection<T>(key)`, `setCollection<T>(key, data)`
- [ ] Định nghĩa toàn bộ types trong `lib/types.ts` (theo mục 3)
- [ ] Viết `scripts/seed.ts` + `lib/seed-data.ts`: 2-3 therapists, 4-5 services (có issueTags), 3-4 programs với 2-3 lessons mỗi program (video YouTube unlisted có sẵn hoặc video demo tạm)
- [ ] Chạy seed, verify data đọc được từ KV qua 1 API test route
- [ ] Deploy thử lên Vercel ngay từ đầu để confirm kết nối KV hoạt động trên production (tránh để dồn lỗi tới cuối)

### Giai đoạn 1 — Module Booking (khoảng 1.5-2 ngày)
- [ ] Component `ServiceSelector` — fetch `/api/services`, hiển thị card chọn
- [ ] Component `TherapistSelector` — fetch `/api/therapists` filter theo specialty của service đã chọn
- [ ] API `/api/availability` — implement logic tính khung giờ trống (phần phức tạp nhất, nên làm kỹ + viết vài test case tay: therapist nghỉ ngày đó, đã kín lịch, còn trống 1 khung...)
- [ ] Component `TimeSlotPicker` — hiển thị các khung giờ trả về, chọn 1 khung
- [ ] Component `BookingForm` — form thông tin khách hàng, validate bằng Zod (client + server)
- [ ] API POST `/api/bookings` — tạo booking, sinh `id` theo format `bk_YYYYMMDD_XXX`
- [ ] Trang `/booking` ghép toàn bộ luồng 4 bước (dùng state đơn giản, không cần thư viện wizard phức tạp)
- [ ] Trang `/booking/confirm` — hiển thị kết quả + section gợi ý program

### Giai đoạn 2 — Trang Admin (khoảng 1 ngày)
- [ ] `middleware.ts` bảo vệ `/admin/*`
- [ ] Trang `/admin/login` + API `/api/auth/login`
- [ ] API GET `/api/bookings` với filter query params
- [ ] API PATCH `/api/bookings/[id]`
- [ ] Component `BookingTable` + `StatusBadge`
- [ ] Trang `/admin/bookings` — ghép bảng + filter + hành động đổi trạng thái

### Giai đoạn 3 — Module E-learning (khoảng 1 ngày)
- [ ] API `/api/programs` (kèm join lessons)
- [ ] Trang `/programs` — grid `ProgramCard`
- [ ] Trang `/programs/[slug]` — chi tiết + `VideoEmbed` (YouTube iframe embed theo `youtubeVideoId`)
- [ ] Logic gợi ý program trên trang `/booking/confirm` (match `issueTags`)

### Giai đoạn 4 — Polish cho demo (khoảng 0.5-1 ngày)
- [ ] Landing page hoàn chỉnh (Header/Footer dùng chung toàn site)
- [ ] Responsive kiểm tra kỹ trên mobile (khách đặt lịch chủ yếu qua điện thoại)
- [ ] Loading states + empty states (VD: không có khung giờ trống trong ngày)
- [ ] Kiểm thử toàn bộ luồng end-to-end trên bản deploy Vercel thật, không chỉ local
- [ ] Chuẩn bị data demo "đẹp" (tên dịch vụ, ảnh, mô tả chỉn chu) cho buổi pitch

**Tổng thời gian ước tính: ~5-6 ngày làm việc** (tuỳ mức độ polish UI và có làm song song hay không).

---

## 7. Phạm vi KHÔNG làm ở MVP (rõ ràng để tránh scope creep)

- Thanh toán online (Momo/VNPay/thẻ) — demo dùng "thanh toán tại chỗ"
- Tài khoản/đăng nhập cho khách hàng — chỉ nhập tên/SĐT mỗi lần đặt
- Thông báo tự động qua Zalo/email/SMS khi có booking mới hoặc đổi trạng thái
- Quiz, chứng chỉ, theo dõi tiến độ học chi tiết trong e-learning
- Multi-admin/phân quyền — chỉ 1 password chung
- Đặt lịch định kỳ (recurring booking)
- Đánh giá/review sau buổi trị liệu

---

## 8. Câu hỏi còn mở — cần chốt trước hoặc trong lúc triển khai

| Câu hỏi | Ảnh hưởng |
|---|---|
| Giờ làm việc của therapist: cố định theo tuần hay có thể set riêng theo ngày (nghỉ phép, lịch đặc biệt)? | Ảnh hưởng schema `workingHours` — MVP nên chọn "cố định theo tuần" trước, thêm ngoại lệ sau nếu cần |
| Video cho `programs`: tự quay sẵn hay cần nguồn tạm để demo? | Ảnh hưởng tiến độ giai đoạn 0 (seed data) |
| Có cần giới hạn đặt lịch trước tối thiểu bao lâu (VD: không cho đặt trong 2 giờ tới)? | Ảnh hưởng logic `/api/availability` |
| Khi khách huỷ lịch, có cần lý do huỷ không? | Ảnh hưởng schema `Booking` (thêm field `cancelReason?`) |
| Sau demo này, hướng phát triển tiếp là gì — dùng thật cho phòng khám hay chỉ để pitch/gọi vốn? | Ảnh hưởng việc có nên đầu tư ngay vào Supabase/Postgres thay vì KV hay không |