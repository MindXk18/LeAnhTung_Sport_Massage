"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Service, Therapist } from "@/lib/types";
import Image from "next/image";
import { PageLoadingSpinner } from "@/components/shared/LoadingSkeleton";
import { Calendar as CalendarIcon, Clock, UserCheck, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

function BookingStepperContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("serviceId") || "";

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  // Selected State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // Customer State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");

  // Loading & Availability
  const [loadingServices, setLoadingServices] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [resSvc, resTh] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/therapists"),
        ]);
        const dataSvc = await resSvc.json();
        const dataTh = await resTh.json();

        if (dataSvc.success) setServices(dataSvc.data);
        if (dataTh.success) setTherapists(dataTh.data);

        if (dataSvc.data.length > 0) {
          setSelectedServiceId((prev) => prev || dataSvc.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoadingServices(false);
      }
    }
    fetchData();
  }, []);

  // Fetch available slots when Service, Therapist, or Date changes
  useEffect(() => {
    if (!selectedServiceId || !selectedDate) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedTimeSlot("");
      setErrorMessage("");
      try {
        const res = await fetch(
          `/api/availability?serviceId=${selectedServiceId}&therapistId=${selectedTherapistId}&date=${selectedDate}`
        );
        const json = await res.json();
        if (json.success) {
          setAvailableSlots(json.data);
        } else {
          setErrorMessage(json.error || "Không thể lấy khung giờ trống");
        }
      } catch {
        setErrorMessage("Lỗi kết nối máy chủ");
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedServiceId, selectedTherapistId, selectedDate]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedTherapist = therapists.find((t) => t.id === selectedTherapistId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage("Vui lòng nhập họ tên đầy đủ");
      return;
    }

    const phoneRegex = /^(0|\+84)[35789][0-9]{8}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      setErrorMessage("Số điện thoại không hợp lệ (Ví dụ: 0912345678)");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          therapistId: selectedTherapistId,
          date: selectedDate,
          startTime: selectedTimeSlot,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          note: note.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        router.push(`/booking/confirm?id=${json.data.id}`);
      } else {
        setErrorMessage(json.error || "Tạo lịch thất bại, vui lòng thử lại");
      }
    } catch {
      setErrorMessage("Lỗi kết nối khi gửi lịch đặt");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Stepper Progress Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-white">Đặt Lịch Trị Liệu Sport Massage</h1>
        <p className="text-slate-400 text-sm mt-1">4 Bước đặt lịch đơn giản — Không cần tạo tài khoản</p>

        <div className="mt-8 flex items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0"></div>
          
          {[
            { num: 1, label: "Chọn gói" },
            { num: 2, label: "Chọn KTV" },
            { num: 3, label: "Khung giờ" },
            { num: 4, label: "Xác nhận" },
          ].map((st) => (
            <div key={st.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= st.num
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {step > st.num ? <CheckCircle2 className="w-5 h-5" /> : st.num}
              </div>
              <span className={`text-xs mt-2 font-medium ${step >= st.num ? "text-emerald-400" : "text-slate-500"}`}>
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Bước 1: Chọn Gói Trị Liệu
            </h2>

            {loadingServices ? (
              <PageLoadingSpinner text="Đang tải danh sách dịch vụ..." />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      selectedServiceId === svc.id
                        ? "bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{svc.name}</h3>
                          {svc.isVip && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded">
                              VIP 120p
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{svc.description}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-xl font-black text-emerald-400">
                          {svc.price.toLocaleString("vi-VN")} đ
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 justify-end">
                          <Clock className="w-3.5 h-3.5" /> {svc.durationMinutes}p (+15p dọn)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                disabled={!selectedServiceId}
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition"
              >
                Tiếp tục: Chọn KTV <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT THERAPIST */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" /> Bước 2: Chọn Kỹ Thuật Viên (5 KTV)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option: Any Therapist */}
              <div
                onClick={() => setSelectedTherapistId("any")}
                className={`p-5 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all ${
                  selectedTherapistId === "any"
                    ? "bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-lg">
                  ★
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Bất kỳ KTV nào</h3>
                  <p className="text-xs text-slate-400">Hệ thống tự sắp xếp KTV rảnh cho bạn</p>
                </div>
              </div>

              {therapists.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setSelectedTherapistId(th.id)}
                  className={`p-5 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all ${
                    selectedTherapistId === th.id
                      ? "bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="w-14 h-14 relative rounded-full overflow-hidden border border-slate-700 shrink-0">
                    <Image
                      src={th.avatarUrl || ""}
                      alt={th.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{th.name}</h3>
                    <p className="text-xs text-emerald-400 font-medium">{th.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition"
              >
                Tiếp tục: Chọn giờ <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT TIME SLOT */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-400" /> Bước 3: Chọn Ngày & Khung Giờ
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <label className="text-sm font-semibold text-slate-300">Chọn ngày trị liệu:</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Giờ làm việc: 08:00 – 20:00. <strong>Nghỉ trưa từ 12:00 – 14:00</strong>. Đã bao gồm 15 phút dọn dẹp vệ sinh phòng.
              </span>
            </div>

            {loadingSlots ? (
              <PageLoadingSpinner text="Đang tính toán các khung giờ trống..." />
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-sm">
                Rất tiếc! Không còn khung giờ nào trống trong ngày {selectedDate} cho lựa chọn này. Vui lòng chọn ngày khác hoặc chọn KTV khác.
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Các khung giờ khả dụng:</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-xl font-mono text-sm font-bold border transition ${
                        selectedTimeSlot === slot
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                          : "bg-slate-950 text-slate-200 border-slate-800 hover:border-emerald-500/50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
              <button
                disabled={!selectedTimeSlot}
                onClick={() => setStep(4)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp tục: Điền thông tin <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOMER DETAILS & SUBMIT */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Bước 4: Xác Nhận Thông Tin Đặt Lịch
            </h2>

            {/* Summary Box */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Gói trị liệu:</span>
                <span className="font-bold text-white">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Kỹ thuật viên:</span>
                <span className="font-bold text-emerald-400">
                  {selectedTherapistId === "any" ? "Bất kỳ KTV rảnh" : selectedTherapist?.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Ngày & Giờ:</span>
                <span className="font-bold text-white">
                  {selectedTimeSlot} — Ngày {selectedDate}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Thanh toán:</span>
                <span className="font-bold text-emerald-300">
                  {selectedService?.price.toLocaleString("vi-VN")} đ (Thanh toán tại phòng khám)
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Họ và tên khách hàng <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Số điện thoại <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Ghi chú về tình trạng chấn thương/căng cơ (Tùy chọn)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Bị căng cơ đùi sau trái khi chạy marathon tuần trước..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl flex items-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? "Đang xử lý đặt lịch..." : "Xác nhận đặt lịch ngay"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<PageLoadingSpinner text="Đang tải trang đặt lịch..." />}>
      <BookingStepperContent />
    </Suspense>
  );
}
