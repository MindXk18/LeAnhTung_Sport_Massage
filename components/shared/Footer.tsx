import { Activity, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg text-white mb-3">
            <Activity className="w-6 h-6 text-emerald-500" />
            <span>Sport Massage & Therapy</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Trung tâm trị liệu chấn thương thể thao, phục hồi cơ sâu & hướng dẫn bài tập tập luyện tự phục hồi tại nhà cho vận động viên và người tập luyện.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Thời gian hoạt động</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Thứ 2 — Chủ Nhật: 08:00 – 20:00</span>
            </li>
            <li className="text-xs text-amber-400 pl-6">
              * Nghỉ trưa từ 12:00 – 14:00 mỗi ngày
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Thông tin liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Hotline đặt lịch: 0987 654 321</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Số 123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-8 pt-6 text-center text-xs text-slate-600">
        © 2026 Sport Massage MVP — Hệ thống Đặt lịch & E-learning bài tập tự phục hồi.
      </div>
    </footer>
  );
}
