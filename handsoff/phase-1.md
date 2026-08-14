# Phase 1 — Booking Module + Nền tảng dự án

> **Trạng thái**: ✅ HOÀN THÀNH  
> **Ngày hoàn thành**: 2026-08-12  
> **Build**: `npm run build` ✅ pass (0 errors, 5 warnings `@next/next/no-img-element`)  
> **Smoke test E2E**: ✅ pass

---

## Tổng quan

Phase 1 bao gồm Giai đoạn 0 (Setup nền tảng) + Giai đoạn 1 (Module Booking) trong Master.md. Đã xây dựng xong toàn bộ luồng đặt lịch 4 bước, trang admin quản lý booking, landing page, và module E-learning cơ bản.

---

## Cấu trúc file đã tạo

```
sport-massage-app/
├── app/
│   ├── layout.tsx                           # Root layout: Inter font, dark theme, Header + Footer
│   ├── page.tsx                             # Landing page: Hero, Services, Therapists, E-learning preview
│   ├── globals.css                          # Tailwind base + smooth scroll
│   ├── booking/
│   │   ├── page.tsx                         # Stepper 4 bước booking (Client Component)
│   │   └── confirm/page.tsx                 # Trang xác nhận + cross-sell E-learning
│   ├── programs/
│   │   ├── page.tsx                         # Grid danh sách chương trình tập (Server Component)
│   │   └── [slug]/page.tsx                  # Chi tiết program + YouTube embed
│   ├── admin/
│   │   └── bookings/page.tsx                # Bảng quản lý booking + filter + duyệt/hủy
│   └── api/
│       ├── services/route.ts                # GET danh sách dịch vụ
│       ├── therapists/route.ts              # GET danh sách KTV
│       ├── availability/route.ts            # GET khung giờ trống (logic phức tạp nhất)
│       ├── bookings/
│       │   ├── route.ts                     # GET list + POST tạo booking
│       │   └── [id]/route.ts                # PATCH đổi trạng thái
│       └── programs/route.ts                # GET danh sách chương trình + filter issueTag
├── components/shared/
│   ├── Header.tsx                           # Sticky header, navigation links
│   └── Footer.tsx                           # Footer thông tin liên hệ
├── lib/
│   ├── types.ts                             # TypeScript interfaces: Therapist, Service, Booking, Program, Lesson
│   ├── schemas.ts                           # Zod validation: BookingSchema
│   ├── kv.ts                                # Dual-storage adapter (Vercel KV / Local JSON)
│   └── seed-data.ts                         # 5 KTV, 2 Services, 2 Programs + 5 Lessons
├── data/                                    # (gitignored) Runtime JSON DB cho local dev
│   └── db.json
├── package.json                             # Next.js 14.2.35, @vercel/kv, zod, lucide-react
└── .gitignore                               # Đã thêm /data/ và /temp-app/
```

---

## Data Schema hiện tại (lib/types.ts)

| Interface | Fields quan trọng |
|-----------|-------------------|
| `Therapist` | `id`, `name`, `title`, `avatarUrl`, `specialties[]`, `workingHours{startTime, endTime, lunchStart, lunchEnd}`, `isActive` |
| `Service` | `id`, `name`, `durationMinutes` (60/120), `bufferMinutes` (15), `price`, `issueTags[]`, `isVip` |
| `Booking` | `id` (bk_YYYYMMDD_XXX), `serviceId`, `therapistId`, `requestedTherapistId`, `customerName`, `customerPhone`, `date`, `startTime`, `endTime`, `bufferEndTime`, `status`, `note?` |
| `Program` | `id`, `slug`, `title`, `issueTags[]`, `lessons: Lesson[]` (embedded) |
| `Lesson` | `id`, `programId`, `title`, `youtubeVideoId`, `durationMinutes`, `order` |

---

## Seed Data (lib/seed-data.ts)

- **5 KTV**: th_001 → th_005 (tất cả giờ làm 08:00-20:00, nghỉ trưa 12:00-14:00)
- **2 Services**: "Gói Thường" (60p, 350,000đ), "Gói VIP" (120p, 650,000đ), cả 2 đều có bufferMinutes=15
- **2 Programs**: "Đau Vai Gáy" (3 lessons), "Đau Thắt Lưng" (2 lessons)
- **Bookings**: Khởi tạo rỗng `[]`

---

## Logic nghiệp vụ đã implement

### Availability Engine (app/api/availability/route.ts)
- Input: `serviceId`, `therapistId` ("any" hoặc ID cụ thể), `date`
- Output: `string[]` — danh sách khung giờ bắt đầu khả dụng (15-minute intervals)
- Rules:
  - Buổi sáng: 08:00 → 12:00 (session phải kết thúc trước 12:00)
  - Buổi chiều: 14:00 → 20:00 (session phải kết thúc trước 20:00)
  - Nghỉ trưa 12:00-14:00: KHÔNG có slot nào rơi vào
  - Buffer 15p sau mỗi session: kiểm tra overlap với booking hiện tại
  - "any" therapist: slot available nếu CÓ ÍT NHẤT 1 KTV rảnh

### Booking Creation (app/api/bookings/route.ts POST)
- Validate input bằng Zod `BookingSchema`
- Nếu therapistId="any" → tìm KTV đầu tiên rảnh trong khung giờ đó
- Sinh ID format `bk_YYYYMMDD_XXX` (3 chữ số ngẫu nhiên)
- Status mặc định: `"pending"`

### Admin Status Update (app/api/bookings/[id]/route.ts PATCH)
- Validate status ∈ ["pending", "confirmed", "completed", "cancelled"]
- Update trong DB, return booking đã cập nhật
- Frontend dùng optimistic update + rollback nếu API fail

### Cross-sell E-learning (booking/confirm/page.tsx)
- Match `issueTags` của service vừa đặt với `issueTags` của programs
- Hiển thị program khớp, hoặc tất cả program nếu không khớp

---

## Bugs đã fix trong Phase 1

| # | Severity | Mô tả |
|---|----------|--------|
| 1 | 🔴 CRITICAL | Admin handleUpdateStatus chỉ update UI, không gọi API |
| 2 | 🔴 CRITICAL | Route PATCH /api/bookings/[id] chưa tồn tại |
| 3 | 🟡 MEDIUM | Phone regex `[3\|5\|7\|8\|9]` sai (match cả dấu `\|`) |
| 4 | 🟡 MEDIUM | Top-level import @vercel/kv crash khi thiếu env vars |
| 5 | 🟢 LOW | globals.css CSS variables ghi đè Tailwind dark theme |
| 6 | 🟢 LOW | .gitignore thiếu /data/ |
| 7 | 🟢 LOW | Unused import verification |

---

## Những thứ CHƯA làm (scope cho phase tiếp theo)

- ❌ `middleware.ts` bảo vệ route `/admin/*` → chưa tạo
- ❌ `/admin/login` page + `/api/auth/login` route → chưa tạo
- ❌ Filter booking theo ngày trên trang admin → UI có nhưng chưa có date picker
- ❌ Responsive mobile → cần kiểm tra và polish
- ❌ Loading skeleton / empty states đẹp → đang dùng text đơn giản
- ❌ `next/image` thay `<img>` → còn 5 warnings
- ❌ Vercel KV production setup → chưa config Upstash
