import Link from "next/link";
import Image from "next/image";
import { getServices, getTherapists, getPrograms } from "@/lib/kv";
import { Calendar, Zap, Shield, PlayCircle, Star, ArrowRight, Clock, Award } from "lucide-react";

export default async function HomePage() {
  const services = await getServices();
  const therapists = await getTherapists();
  const programs = await getPrograms();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 pt-16 pb-24 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap className="w-3.5 h-3.5" /> Giải Pháp Trị Liệu Thể Thao Đột Phá
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Đặt Lịch Trị Liệu Sport Massage <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              + Bài Tập Phục Hồi Tại Nhà
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
            Không chỉ trị liệu giải bó cơ sâu tại chỗ — khách hàng nhận ngay video hướng dẫn tập giãn cơ cá nhân hóa theo tình trạng tổn thương.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" /> Đặt lịch trị liệu ngay
            </Link>
            <Link
              href="/programs"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <PlayCircle className="w-5 h-5 text-emerald-400" /> Xem thư viện bài tập
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800 text-left">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-semibold text-sm">Chuyên nghiệp</div>
                <div className="text-slate-400 text-xs">5 KTV giàu kinh nghiệm</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-semibold text-sm">Khung giờ chuẩn</div>
                <div className="text-slate-400 text-xs">8h - 20h (Nghỉ 12h-14h)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-semibold text-sm">Gói VIP 120p</div>
                <div className="text-slate-400 text-xs">Phục hồi toàn thân</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-semibold text-sm">E-Learning kèm</div>
                <div className="text-slate-400 text-xs">Bài tập về nhà miễn phí</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Danh Sách Gói Trị Liệu</h2>
          <p className="mt-2 text-slate-400">Đã bao gồm 15 phút dọn dẹp vệ sinh phòng giữa các ca phục vụ.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={`rounded-2xl p-8 border transition-all ${
                svc.isVip
                  ? "bg-gradient-to-b from-amber-950/30 to-slate-900 border-amber-500/40 relative shadow-xl shadow-amber-950/20"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              {svc.isVip && (
                <span className="absolute -top-3 right-6 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold uppercase rounded-full tracking-wider shadow">
                  Gói Được Yêu Thích Nổi Bật
                </span>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{svc.name}</h3>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm mt-1">
                    <Clock className="w-4 h-4" /> {svc.durationMinutes} phút liệu trình (+15p dọn dẹp)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    {svc.price.toLocaleString("vi-VN")} đ
                  </div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{svc.description}</p>
              <Link
                href={`/booking?serviceId=${svc.id}`}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                  svc.isVip
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                Đặt gói này ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Therapists Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Đội Ngũ Kỹ Thuật Viên (5 KTV)</h2>
          <p className="mt-2 text-slate-400">Được đào tạo bài bản về giải cơ thể thao & phục hồi vận động.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.filter((th) => th.isActive).map((th) => (
            <div
              key={th.id}
              className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/40 transition-all duration-200"
            >
              <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-emerald-500/50 mb-4 group-hover:border-emerald-400/80 transition-all duration-200">
                <Image
                  src={th.avatarUrl || ""}
                  alt={th.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <h3 className="text-xl font-bold text-white">{th.name}</h3>
              <p className="text-xs text-emerald-400 font-medium mb-3">{th.title}</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{th.bio}</p>
              <div className="w-full pt-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>Khung giờ: 08:00 – 20:00</span>
                <span className="text-amber-400 font-semibold">Nghỉ 12h-14h</span>
              </div>
              <div className="mt-3 w-full py-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Đặt lịch với KTV này <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* E-learning Cross-Sell Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">Tập luyện tự phục hồi</span>
            <h2 className="text-3xl font-bold text-white mt-2">Thư Viện Bài Tập Về Nhà Đi Kèm</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">
              Sau khi trị liệu tại phòng khám, khách hàng sẽ nhận được đường link mở khóa bài tập tự giãn cơ chuẩn y khoa ngay trên điện thoại để ngăn ngừa tái phát chấn thương.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/programs"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 transition"
              >
                Khám phá bài tập <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {programs.map((prog) => (
              <div key={prog.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex gap-4 items-center">
                <div className="w-24 h-16 relative rounded-lg overflow-hidden shrink-0">
                  <Image src={prog.thumbnailUrl || ""} alt={prog.title} fill className="object-cover" sizes="96px" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{prog.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{prog.description}</p>
                  <span className="text-xs text-emerald-400 font-semibold mt-2 inline-block">
                    {prog.lessons.length} bài tập video
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
