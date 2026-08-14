"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Booking, Service, Therapist, Program } from "@/lib/types";
import { PageLoadingSpinner } from "@/components/shared/LoadingSkeleton";
import { CheckCircle, Calendar, Clock, User, Phone, PlayCircle, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [recommendedPrograms, setRecommendedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    async function fetchBookingDetails() {
      try {
        const [resBk, resSvc, resTh, resProg] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/services"),
          fetch("/api/therapists"),
          fetch("/api/programs"),
        ]);

        const dataBk = await resBk.json();
        const dataSvc = await resSvc.json();
        const dataTh = await resTh.json();
        const dataProg = await resProg.json();

        if (dataBk.success) {
          const foundBk = dataBk.data.find((b: Booking) => b.id === bookingId);
          if (foundBk) {
            setBooking(foundBk);

            if (dataSvc.success) {
              const foundSvc = dataSvc.data.find((s: Service) => s.id === foundBk.serviceId);
              setService(foundSvc);

              // Recommend programs by issueTags matching
              if (foundSvc && dataProg.success) {
                const matched = dataProg.data.filter((p: Program) =>
                  p.issueTags.some((tag: string) => foundSvc.issueTags.includes(tag))
                );
                setRecommendedPrograms(matched.length > 0 ? matched : dataProg.data);
              }
            }

            if (dataTh.success) {
              const foundTh = dataTh.data.find((t: Therapist) => t.id === foundBk.therapistId);
              setTherapist(foundTh);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch booking confirm details", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return <PageLoadingSpinner text="Đang tải thông tin đặt lịch..." />;
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Không tìm thấy đơn đặt lịch</h1>
        <p className="text-slate-400">Mã đặt lịch không tồn tại hoặc đã bị hủy.</p>
        <Link href="/booking" className="inline-block px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl">
          Tạo đặt lịch mới
        </Link>
      </div>
    );
  }

  const cleanPhone = booking.customerPhone.replace(/\D/g, "");
  const zaloUrl = `https://zalo.me/${cleanPhone}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Success Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold rounded-full uppercase tracking-wider">
            Đặt Lịch Thành Công
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-3">Mã đặt lịch: <span className="text-emerald-400">{booking.id}</span></h1>
          <p className="text-slate-400 text-sm mt-1">Cảm ơn bạn đã tin tưởng dịch vụ trị liệu Sport Massage!</p>
        </div>

        {/* Details Grid */}
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">Khách hàng</div>
              <div className="font-bold text-white">{booking.customerName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">Số điện thoại</div>
              <div className="font-bold text-white">{booking.customerPhone}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">Ngày trị liệu</div>
              <div className="font-bold text-white">{booking.date}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">Khung giờ</div>
              <div className="font-bold text-emerald-300">
                {booking.startTime} – {booking.endTime} (+15p dọn dẹp phòng)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2 pt-2 border-t border-slate-900">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">Kỹ thuật viên phụ trách & Dịch vụ</div>
              <div className="font-bold text-white">
                KTV {therapist?.name} — {service?.name}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
          >
            <MessageSquare className="w-5 h-5" /> Trực tiếp Zalo hỗ trợ xác nhận
          </a>
          <Link
            href="/booking"
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl flex items-center justify-center transition"
          >
            Đặt thêm lịch mới
          </Link>
        </div>
      </div>

      {/* Cross-Sell E-learning Section (Core USP) */}
      <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <PlayCircle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Món quà đi kèm từ phòng khám</span>
            <h2 className="text-xl font-bold text-white">Bài Tập Tự Phục Hồi Tại Nhà Cho Bạn</h2>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          Để duy trì hiệu quả trị liệu lâu dài và phòng ngừa chấn thương tái phát, chuyên gia trị liệu tặng bạn chuỗi bài tập tự tập tại nhà phù hợp với gói dịch vụ bạn vừa đăng ký:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendedPrograms.map((prog) => (
            <div key={prog.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="relative w-full h-36 rounded-xl overflow-hidden mb-4">
                  <Image src={prog.thumbnailUrl || ""} alt={prog.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{prog.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{prog.description}</p>
              </div>
              <Link
                href={`/programs/${prog.slug}`}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                Xem bài tập video ngay <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<PageLoadingSpinner text="Đang tải..." />}>
      <ConfirmContent />
    </Suspense>
  );
}
