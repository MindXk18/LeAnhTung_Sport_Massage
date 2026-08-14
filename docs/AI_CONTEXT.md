# AI Context — Sport Massage MVP

> ⚠️ **ĐỌC FILE NÀY TRƯỚC KHI CODE BẤT KỲ THỨ GÌ TRONG DỰ ÁN NÀY**
> File này cung cấp context tổng quan cho AI assistant hiểu trạng thái hiện tại của dự án.
> Cập nhật lần cuối: 2026-08-12 (sau Phase 2)

---

## 1. Dự án là gì?

Website MVP demo cho dịch vụ **Sport Massage** (trị liệu chấn thương thể thao) với 2 module chính:
1. **Booking** — Khách đặt lịch trị liệu online (không cần tài khoản)
2. **E-learning** — Thư viện video bài tập phục hồi tại nhà (cross-sell sau khi đặt lịch)

**Nguyên tắc xuyên suốt**: Nhanh > hoàn hảo. Không over-engineer. MVP cho demo/pitch.

---

## 2. Tech Stack

| Thành phần | Chi tiết |
|------------|----------|
| Framework | Next.js 14.2.35 (App Router, TypeScript) |
| Styling | Tailwind CSS 3.4 |
| UI Icons | lucide-react |
| Validation | Zod 4.x |
| Storage | Dual adapter: Vercel KV (production) / Local JSON file (dev) |
| Font | Inter (Google Fonts, subsets: latin + vietnamese) |
| Theme | Dark mode (bg-slate-950, text-slate-100, accent emerald) |
| Deploy target | Vercel |

---

## 3. Cấu trúc thư mục hiện tại

```
app/
├── layout.tsx              # Root layout (Header + main + Footer)
├── page.tsx                # Landing page (next/Image)
├── globals.css
├── booking/
│   ├── page.tsx            # Stepper 4 bước (Client Component, next/Image)
│   └── confirm/page.tsx    # Xác nhận + cross-sell E-learning (next/Image)
├── programs/
│   ├── page.tsx            # Grid chương trình + filter tags (Client Component, next/Image)
│   └── [slug]/page.tsx     # Accordion lesson list (Client Component)
├── admin/
│   ├── login/page.tsx      # Trang login admin
│   └── bookings/page.tsx   # Bảng quản lý booking + logout button
└── api/
    ├── auth/
    │   ├── login/route.ts  # POST login
    │   └── logout/route.ts # POST logout
    ├── services/route.ts
    ├── therapists/route.ts
    ├── availability/route.ts
    ├── bookings/
    │   ├── route.ts        # GET + POST
    │   └── [id]/route.ts   # PATCH
    └── programs/route.ts

middleware.ts               # Bảo vệ /admin/* routes

components/shared/
├── Header.tsx
└── Footer.tsx

lib/
├── types.ts                # Interfaces: Therapist, Service, Booking, Program, Lesson
├── schemas.ts              # Zod: BookingSchema
├── kv.ts                   # Storage adapter (dynamic import @vercel/kv)
└── seed-data.ts            # 5 KTV, 2 Services, 2 Programs, 5 Lessons
```

---

## 4. Data hiện tại

### Therapists (5 KTV)
| ID | Tên | Giờ làm |
|----|-----|---------|
| th_001 | Nguyễn Văn Anh | 08:00-20:00, nghỉ 12:00-14:00 |
| th_002 | Trần Thị Bích | 08:00-20:00, nghỉ 12:00-14:00 |
| th_003 | Lê Hoàng Cường | 08:00-20:00, nghỉ 12:00-14:00 |
| th_004 | Phạm Minh Đức | 08:00-20:00, nghỉ 12:00-14:00 |
| th_005 | Vũ Thanh Em | 08:00-20:00, nghỉ 12:00-14:00 |

### Services (2 gói)
| ID | Tên | Thời lượng | Buffer | Giá |
|----|-----|-----------|--------|-----|
| sv_001 | Gói Thường | 60p | 15p | 350,000đ |
| sv_002 | Gói VIP | 120p | 15p | 650,000đ |

### Programs (4 chương trình)
| ID | Slug | Tên | Tags | Lessons |
|----|------|-----|------|--------|
| pg_001 | dau-vai-gay | Bài tập Vai Gáy | vai-gay, stretching, cot-song | 3 bài |
| pg_002 | dau-thap-lung | Phục hồi Thắt Lưng | dau-lung, cot-song, gym | 2 bài |
| pg_003 | phuc-hoi-goi-runner | Phục hồi Gối Runner | dau-goi, co-chan, chay-bo | 3 bài |
| pg_004 | gian-co-toan-than | Giãn cơ toàn thân Gym | stretching, gym, phuc-hoi-toan-than, co-dui | 3 bài |

---

## 5. Logic nghiệp vụ quan trọng

### Availability (tính khung giờ trống)
- Slot interval: 15 phút
- Sáng: 08:00 → session kết thúc ≤ 12:00
- Chiều: 14:00 → session kết thúc ≤ 20:00
- Nghỉ trưa 12:00-14:00: KHÔNG có slot
- Overlap check: `candStart + duration + buffer` so với `bStart → bBufEnd` của booking đã có
- "Bất kỳ KTV": available nếu ≥ 1 KTV rảnh

### Booking ID format
- `bk_YYYYMMDD_XXX` (3 chữ số random)
- Status flow: pending → confirmed → completed (hoặc → cancelled bất kỳ lúc nào)

### Storage (lib/kv.ts)
- `hasVercelKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)`
- Nếu true → dynamic `import("@vercel/kv")` → dùng Redis
- Nếu false → đọc/ghi file `data/db.json` (auto-seed từ `seed-data.ts`)

---

## 6. Trạng thái hoàn thành theo Phase

| Phase | Nội dung | Trạng thái |
|-------|----------|------------|
| Phase 0 | Setup nền tảng, types, kv adapter, seed data | ✅ DONE |
| Phase 1 | Booking module (stepper, availability, API, confirm, admin) | ✅ DONE |
| Phase 2 | Admin auth + E-learning polish + Quick wins (next/Image, tags) | ✅ DONE |
| Phase 3 | E-learning media thật + Loading skeletons + UI polish + Lint clean | ✅ DONE |

---

## 7. Những thứ lưu ý / mở rộng tương lai (nếu lên Production chính thức)

- ℹ️ **Vercel KV production** — Để deploy Vercel với persistent KV, chỉ cần điền biến môi trường `KV_REST_API_URL` & `KV_REST_API_TOKEN` từ Upstash.
- ℹ️ **Admin password** — Cấu hình qua `.env.local` (`ADMIN_PASSWORD=123456789`).
- ℹ️ **Dữ liệu demo** — Đã có sẵn 5 KTV, 2 Dịch vụ, 4 Chương trình phục hồi với 11 video bài tập thật từ YouTube.

---

## 8. Conventions cần tuân thủ

- **Naming**: File/folder kebab-case. Components PascalCase.
- **API response format**: `{ success: boolean, data?: T, error?: string }`
- **Validation**: Zod schema ở `lib/schemas.ts`, validate cả client + server
- **Color palette**: emerald (accent), slate (background), amber (warning), rose (danger)
- **Comments**: Tiếng Việt cho UI text, tiếng Anh cho code comments
- **Storage**: Luôn qua `lib/kv.ts`, KHÔNG đọc file/KV trực tiếp
- **Phone regex**: `/^(0|\+84)[35789][0-9]{8}$/`
- **Admin password**: via `process.env.ADMIN_PASSWORD` (default: `123456789`)
- **Session cookie**: `admin_session`, HttpOnly, 7 days, token = base64(ADMIN_SESSION_SECRET).slice(0,32)

---

## 9. Tham khảo thêm

- **Master doc** (kiến trúc + roadmap đầy đủ): [docs/Master.md](../docs/Master.md)
- **Phase handoffs**: Xem folder [handsoff/](../handsoff/) cho context từng phase
