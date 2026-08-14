import { z } from "zod";

export const BookingSchema = z.object({
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  therapistId: z.string().min(1, "Vui lòng chọn kỹ thuật viên"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Khung giờ không hợp lệ"),
  customerName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  customerPhone: z.string().regex(/^(0|\+84)[35789][0-9]{8}$/, "Số điện thoại không hợp lệ (Ví dụ: 0912345678)"),
  note: z.string().optional(),
});

export type BookingInput = z.infer<typeof BookingSchema>;
