# 🚀 Hướng dẫn Deploy lên Vercel + Setup Upstash Redis (KV)

> **Dành cho**: Dự án Sport Massage MVP  
> **Thời gian**: ~15 phút  
> **Yêu cầu**: Tài khoản GitHub + Vercel (miễn phí)

---

## Phần 1: Deploy lên Vercel (miễn phí)

### Bước 1: Push code lên GitHub
```bash
cd e:\RnDWork\MindX_Kick_Off_VibeCode\LeAnhTung_Sport_Massage

# Kiểm tra git status
git status

# Add tất cả file
git add .
git commit -m "MVP ready for production deploy"

# Push lên GitHub (tạo repo mới trên github.com trước nếu chưa có)
git remote add origin https://github.com/YOUR_USERNAME/sport-massage-mvp.git
git push -u origin main
```

### Bước 2: Kết nối Vercel
1. Truy cập [vercel.com](https://vercel.com) → Đăng nhập bằng GitHub
2. Click **"Add New Project"**
3. Chọn repo `sport-massage-mvp` từ danh sách
4. Framework Preset: Chọn **Next.js** (thường tự detect)
5. Cấu hình **Environment Variables** (quan trọng!):

| Tên biến | Giá trị | Ghi chú |
|----------|---------|---------|
| `ADMIN_PASSWORD` | `123456789` | Mật khẩu đăng nhập admin |
| `ADMIN_SESSION_SECRET` | `sport-massage-mvp-secret-2026` | Secret tạo token session |

6. Click **Deploy** → Đợi 2-3 phút

### Bước 3: Verify
- Truy cập URL Vercel cấp (ví dụ: `https://sport-massage-mvp.vercel.app`)
- Kiểm tra: Trang chủ, Đặt lịch, Thư viện bài tập, Admin login

---

## Phần 2: Setup Upstash Redis (Vercel KV) — Tùy chọn

> ⚠️ **Lưu ý**: App đã hoạt động **không cần KV**! 
> Mặc định sử dụng in-memory storage (dữ liệu reset khi serverless function cold start).
> Chỉ cần setup KV nếu bạn muốn dữ liệu booking **lưu trữ lâu dài** giữa các lần deploy.

### Cách 1: Dùng Vercel KV Integration (Nhanh nhất)

1. Vào **Vercel Dashboard** → Chọn project → Tab **Storage**
2. Click **"Create Database"** → Chọn **KV (Upstash)**
3. Đặt tên: `sport-massage-kv` → Region: `ap-southeast-1` (Singapore - gần VN nhất)
4. Vercel sẽ **tự động thêm** 2 biến môi trường vào project:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
5. **Redeploy** project: Vào tab Deployments → Click "..." → **Redeploy**

### Cách 2: Tự tạo Upstash Redis (Nếu cần kiểm soát hơn)

1. Truy cập [upstash.com](https://upstash.com) → Tạo tài khoản miễn phí
2. Tạo Redis Database mới:
   - Name: `sport-massage-kv`
   - Region: `ap-southeast-1`
   - Type: **Regional** (miễn phí đủ dùng cho MVP)
3. Sau khi tạo, copy 2 giá trị từ tab **REST API**:
   - `UPSTASH_REDIS_REST_URL` → paste vào Vercel env var `KV_REST_API_URL`
   - `UPSTASH_REDIS_REST_TOKEN` → paste vào Vercel env var `KV_REST_API_TOKEN`
4. Vào Vercel Dashboard → Settings → Environment Variables → Thêm 2 biến trên
5. **Redeploy** project

### Verify KV hoạt động
```
# Sau khi redeploy, truy cập:
https://your-app.vercel.app/api/services

# Nếu trả về JSON với success: true → KV đã hoạt động
# Lần đầu tiên sẽ tự động seed dữ liệu mẫu vào KV
```

---

## Phần 3: Cấu hình Domain tùy chỉnh (Tùy chọn)

1. Vercel Dashboard → Settings → Domains
2. Thêm domain: `massage.yourdomain.com`
3. Cấu hình DNS theo hướng dẫn Vercel hiển thị (CNAME record)

---

## Tóm tắt Biến Môi Trường

| Biến | Bắt buộc? | Giá trị mặc định | Mô tả |
|------|-----------|-------------------|-------|
| `ADMIN_PASSWORD` | Khuyến khích | `123456789` | Mật khẩu vào trang quản trị |
| `ADMIN_SESSION_SECRET` | Khuyến khích | `default-secret` | Secret key tạo session token |
| `KV_REST_API_URL` | Không | _(trống)_ | URL Redis từ Upstash/Vercel KV |
| `KV_REST_API_TOKEN` | Không | _(trống)_ | Token xác thực Redis |

---

## Ghi chú kỹ thuật

### Storage fallback
- **Có KV_REST_API_URL + KV_REST_API_TOKEN** → Dùng Upstash Redis (persistent)
- **Không có** → Dùng in-memory storage (dữ liệu mất khi cold start, đủ cho demo)

### Giới hạn Vercel Free Plan
- 100GB bandwidth/tháng
- Serverless Function timeout: 10s
- Edge Middleware: Không giới hạn
- KV (Upstash): 10,000 commands/ngày miễn phí (dư xài cho demo)

### Troubleshooting
- **500 Internal Server Error**: Kiểm tra Environment Variables đã được set đúng chưa
- **Middleware redirect loop**: Đảm bảo `ADMIN_SESSION_SECRET` giống nhau ở cả login route và middleware
- **Video không phát**: Xóa cache browser (Ctrl+Shift+R) hoặc thử Incognito mode
