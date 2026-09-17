"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Zap,
  Shield,
  PlayCircle,
  Star,
  ArrowRight,
  Clock,
  Award,
  Activity,
  Music2,
} from "lucide-react";
import {
  FacebookIcon,
  TwitterIcon,
  YoutubeIcon,
  InstagramIcon,
} from "@/components/icons/SocialIcons";
import { Service, Therapist, Program } from "@/lib/types";

interface SportMassageLandingProps {
  services: Service[];
  therapists: Therapist[];
  programs: Program[];
}

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4";

export default function SportMassageLanding({
  services,
  therapists,
  programs,
}: SportMassageLandingProps) {
  const activeTherapists = therapists.filter((th) => th.isActive);

  return (
    <div className="relative w-full min-h-[115vh] overflow-x-hidden flex flex-col items-center font-sans selection:bg-white/20 selection:text-white">
      {/* ═══════════════════ VIDEO BACKGROUND ═══════════════════ */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-[0]"
        autoPlay
        loop
        muted
        playsInline
        src={VIDEO_SRC}
      />

      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/40 z-[1]" />

      {/* ═══════════════════ CONTENT WRAPPER ═══════════════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col pt-8">
        {/* ─────── HERO / UPPER CTA ─────── */}
        <section className="pt-16 sm:pt-24 pb-16 text-center">
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Zap className="w-3.5 h-3.5" /> Giải Pháp Trị Liệu Thể Thao Đột
            Phá
          </motion.span>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            Đặt Lịch Trị Liệu Sport Massage{" "}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              + Bài Tập Phục Hồi Tại Nhà
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-slate-200/80 max-w-2xl mx-auto font-normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            Không chỉ trị liệu giải bó cơ sâu tại chỗ — khách hàng nhận ngay
            video hướng dẫn tập giãn cơ cá nhân hóa theo tình trạng tổn thương.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              href="/booking"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" /> Đặt lịch trị liệu ngay
            </Link>
            <Link
              href="/programs"
              className="w-full sm:w-auto px-8 py-4 rounded-xl liquid-glass text-white font-semibold text-lg flex items-center justify-center gap-2 transition hover:bg-white/5"
            >
              <PlayCircle className="w-5 h-5 text-emerald-400" /> Xem thư viện
              bài tập
            </Link>
          </motion.div>

          {/* 4 Stats — liquid-glass mini cards */}
          <motion.div
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            {[
              {
                icon: Shield,
                title: "Chuyên nghiệp",
                sub: `${activeTherapists.length} KTV giàu kinh nghiệm`,
              },
              {
                icon: Clock,
                title: "Khung giờ chuẩn",
                sub: "8h - 20h (Nghỉ 12h-14h)",
              },
              {
                icon: Award,
                title: "Gói VIP 120p",
                sub: "Phục hồi toàn thân",
              },
              {
                icon: Star,
                title: "E-Learning kèm",
                sub: "Bài tập về nhà miễn phí",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.title}
                className="liquid-glass rounded-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.9 + i * 0.1,
                  ease: "easeOut",
                }}
              >
                <stat.icon className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white font-semibold text-sm">
                    {stat.title}
                  </div>
                  <div className="text-white/50 text-xs">{stat.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─────── GÓI TRỊ LIỆU ─────── */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Danh Sách Gói Trị Liệu
            </h2>
            <p className="mt-2 text-white/50">
              Đã bao gồm 15 phút dọn dẹp vệ sinh phòng giữa các ca phục vụ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((svc, i) => (
              <motion.div
                key={svc.id}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4 }}
              >
                {svc.isVip && (
                  <span className="absolute -top-3 right-6 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold uppercase rounded-full tracking-wider shadow z-20">
                    Gói Được Yêu Thích Nổi Bật
                  </span>
                )}
                <div className={`liquid-glass rounded-2xl p-8 h-full transition-all ${
                  svc.isVip
                    ? "ring-1 ring-amber-500/30 shadow-xl shadow-amber-950/20"
                    : ""
                }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {svc.name}
                    </h3>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm mt-1">
                      <Clock className="w-4 h-4" /> {svc.durationMinutes} phút
                      liệu trình (+15p dọn dẹp)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">
                      {svc.price.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {svc.description}
                </p>
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
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─────── ĐỘI NGŨ KTV ─────── */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Đội Ngũ Kỹ Thuật Viên ({activeTherapists.length} KTV)
            </h2>
            <p className="mt-2 text-white/50">
              Được đào tạo bài bản về giải cơ thể thao &amp; phục hồi vận động.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTherapists.map((th, i) => (
              <motion.div
                key={th.id}
                className="group liquid-glass rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4, scale: 1.02 }}
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
                <p className="text-xs text-emerald-400 font-medium mb-3">
                  {th.title}
                </p>
                <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">
                  {th.bio}
                </p>
                <div className="w-full pt-3 border-t border-white/10 text-xs text-white/40 flex justify-between">
                  <span>Khung giờ: 08:00 – 20:00</span>
                  <span className="text-amber-400 font-semibold">
                    Nghỉ 12h-14h
                  </span>
                </div>
                <div className="mt-3 w-full py-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all flex items-center justify-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Đặt lịch với KTV này{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─────── THƯ VIỆN BÀI TẬP PREVIEW ─────── */}
        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="liquid-glass rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">
                  Tập luyện tự phục hồi
                </span>
                <h2 className="text-3xl font-bold text-white mt-2">
                  Thư Viện Bài Tập Về Nhà Đi Kèm
                </h2>
                <p className="mt-4 text-white/60 leading-relaxed">
                  Sau khi trị liệu tại phòng khám, khách hàng sẽ nhận được
                  đường link mở khóa bài tập tự giãn cơ chuẩn y khoa ngay trên
                  điện thoại để ngăn ngừa tái phát chấn thương.
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
                {programs.map((prog, i) => (
                  <motion.div
                    key={prog.id}
                    className="liquid-glass rounded-xl p-4 flex gap-4 items-center"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <div className="w-24 h-16 relative rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={prog.thumbnailUrl || ""}
                        alt={prog.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {prog.title}
                      </h4>
                      <p className="text-xs text-white/40 line-clamp-1 mt-1">
                        {prog.description}
                      </p>
                      <span className="text-xs text-emerald-400 font-semibold mt-2 inline-block">
                        {prog.lessons.length} bài tập video
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <motion.footer
        className="liquid-glass w-full rounded-3xl p-6 md:p-10 text-white/70 mt-32 md:mt-64 relative z-10 max-w-7xl mx-4 sm:mx-auto mb-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        {/* Top Grid: 12-column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-white mb-4">
              <Activity className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-medium">SPORT MASSAGE</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Trung tâm trị liệu chấn thương thể thao, phục hồi cơ sâu &amp;
              hướng dẫn bài tập tự phục hồi tại nhà cho vận động viên và người
              tập luyện.
            </p>
          </div>

          {/* Links — 3-column grid */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Dịch vụ */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">
                Dịch vụ
              </h4>
              <ul className="text-xs space-y-2">
                {[
                  { label: "Gói Thường 60 phút", href: "/booking" },
                  { label: "Gói VIP 120 phút", href: "/booking" },
                  { label: "Đặt lịch ngay", href: "/booking" },
                  { label: "Bảng giá", href: "#" },
                  { label: "Khuyến mãi", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Về chúng tôi */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">
                Về chúng tôi
              </h4>
              <ul className="text-xs space-y-2">
                {[
                  "Đội ngũ KTV",
                  "Câu chuyện thương hiệu",
                  "Tuyển dụng",
                  "Tin tức",
                ].map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">
                Hỗ trợ
              </h4>
              <ul className="text-xs space-y-2">
                {[
                  "Liên hệ Hotline",
                  "Chính sách bảo mật",
                  "Điều khoản sử dụng",
                  "Khiếu nại",
                ].map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <p className="text-[10px] uppercase tracking-widest opacity-50">
            © 2026 Sport Massage — Hệ thống Đặt lịch &amp; E-learning
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest opacity-50">
              Theo dõi chúng tôi:
            </span>
            {[
              { Icon: Music2, label: "Music" },
              { Icon: FacebookIcon, label: "Facebook" },
              { Icon: TwitterIcon, label: "Twitter" },
              { Icon: YoutubeIcon, label: "Youtube" },
              { Icon: InstagramIcon, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="opacity-70 hover:opacity-100 transition-colors hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
