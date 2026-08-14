# Phase 2 — Admin Auth + E-learning Polish + Quick Wins

> **Trạng thái**: ✅ HOÀN THÀNH  
> **Ngày hoàn thành**: 2026-08-12  
> **Build**: `npm run build` ✅ pass (exit code 0, 0 errors)  
> **Smoke test**: ✅ 4/4 tests passed (Auth flow, Programs filter, Lesson accordion, Logout)

---

## Tổng quan

Phase 2 gộp Giai đoạn 2 (Admin Auth) + Giai đoạn 3 (E-learning Polish) + Quick Wins từ Giai đoạn 4 theo Master.md.

---

## Files đã tạo mới

| File | Mô tả |
|------|--------|
| `middleware.ts` | Bảo vệ `/admin/*` routes, redirect → `/admin/login` nếu thiếu cookie |
| `app/admin/login/page.tsx` | Trang login admin — form password, show/hide toggle, error display, loading state |
| `app/api/auth/login/route.ts` | POST — validate password vs `ADMIN_PASSWORD` env, set HttpOnly cookie 7 ngày |
| `app/api/auth/logout/route.ts` | POST — clear session cookie (maxAge=0) |
| `.env.local` | `ADMIN_PASSWORD=123456789`, `ADMIN_SESSION_SECRET=...` |

## Files đã sửa

| File | Thay đổi |
|------|----------|
| `app/admin/bookings/page.tsx` | Thêm nút "Đăng xuất" (gọi POST `/api/auth/logout` → redirect login) |
| `next.config.mjs` | Thêm `images.remotePatterns` cho `images.unsplash.com` |
| `app/page.tsx` | Thay `<img>` → `next/Image` (2 nơi: therapist avatar + program thumbnail) |
| `app/booking/page.tsx` | Thay `<img>` → `next/Image` (1 nơi: therapist avatar) |
| `app/booking/confirm/page.tsx` | Thay `<img>` → `next/Image` (1 nơi: program thumbnail) |
| `app/programs/page.tsx` | **Rewrite**: Server → Client Component, thêm filter tag chips, `next/Image` |
| `app/programs/[slug]/page.tsx` | **Rewrite**: Server → Client Component, lesson accordion (click to open/close video), "Đang xem" badge |
| `lib/seed-data.ts` | Thêm 2 programs mới + mở rộng tags |

---

## Hệ thống Tag mới (brainstormed)

| Tag ID | Label Tiếng Việt | Dùng trong |
|--------|-------------------|------------|
| `vai-gay` | Vai Gáy | sv_001, pg_001 |
| `dau-lung` | Đau Lưng | sv_001, pg_002 |
| `dau-goi` | Đau Gối | sv_002, pg_003 |
| `co-dui` | Căng Cơ Đùi | sv_001, pg_004 |
| `phuc-hoi-toan-than` | Phục Hồi Toàn Thân | sv_002, pg_004 |
| `cot-song` | Cột Sống | pg_001, pg_002 (MỚI) |
| `co-chan` | Cổ Chân | pg_003 (MỚI) |
| `chay-bo` | Dành Cho Runner | pg_003 (MỚI) |
| `gym` | Dành Cho Gym | pg_002, pg_004 (MỚI) |
| `stretching` | Giãn Cơ Tổng Hợp | pg_001, pg_004 (MỚI) |

---

## Programs mới (seed-data.ts)

| ID | Slug | Title | Tags | Lessons |
|----|------|-------|------|---------|
| pg_003 | phuc-hoi-goi-runner | Phục hồi khớp gối & cổ chân cho Runner | dau-goi, co-chan, chay-bo | 3 bài |
| pg_004 | gian-co-toan-than | Giãn cơ toàn thân 15 phút sau tập Gym | stretching, gym, phuc-hoi-toan-than, co-dui | 3 bài |

---

## Auth Flow Logic

```
User truy cập /admin/* 
  → middleware.ts check cookie "admin_session"
    → Nếu thiếu/sai → redirect /admin/login?from=/admin/bookings
    → Nếu đúng → pass through

Login form submit:
  → POST /api/auth/login { password }
    → So sánh với process.env.ADMIN_PASSWORD
    → Đúng → set cookie "admin_session" (HttpOnly, 7 days, base64 hash of secret)
    → Sai → return { success: false, error: "Sai mật khẩu" }

Logout:
  → POST /api/auth/logout → clear cookie → redirect /admin/login
```

---

## Smoke Test Results

| Test | Mô tả | Kết quả |
|------|--------|---------|
| 1 | Admin Auth: redirect → login → wrong password → correct password → dashboard | ✅ PASS |
| 2 | Programs: 4 cards hiển thị, filter "Dành Cho Runner" → 1 card, reset "Tất cả" → 4 cards | ✅ PASS |
| 3 | Program Detail: 1st lesson auto-open, click lesson 2 → close lesson 1, "Đang xem" badge | ✅ PASS |
| 4 | Logout: click → redirect login, truy cập trực tiếp /admin/bookings → redirect login | ✅ PASS |
