"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Booking, Service, Therapist } from "@/lib/types";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { ShieldCheck, MessageSquare, Phone, Calendar, Clock, RefreshCw, CheckCircle, XCircle, Clock3, LogOut, Inbox } from "lucide-react";

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resBk, resSvc, resTh] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/services"),
        fetch("/api/therapists"),
      ]);

      const dataBk = await resBk.json();
      const dataSvc = await resSvc.json();
      const dataTh = await resTh.json();

      if (dataBk.success) setBookings(dataBk.data as Booking[]);
      if (dataSvc.success) setServices(dataSvc.data as Service[]);
      if (dataTh.success) setTherapists(dataTh.data as Therapist[]);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Booking["status"]) => {
    setUpdatingId(id);
    // Optimistic update
    const previousBookings = [...bookings];
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) {
        // Rollback on failure
        setBookings(previousBookings);
        console.error("Failed to update status:", json.error);
      }
    } catch {
      // Rollback on network error
      setBookings(previousBookings);
      console.error("Network error updating booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  const getServiceName = (id: string) => services.find((s) => s.id === id)?.name || id;
  const getTherapistName = (id: string) => therapists.find((t) => t.id === id)?.name || id;

  const renderStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full flex items-center gap-1 w-fit">
            <Clock3 className="w-3.5 h-3.5" /> Chờ xác nhận
          </span>
        );
      case "confirmed":
        return (
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-full flex items-center gap-1 w-fit">
            <CheckCircle className="w-3.5 h-3.5" /> Đã xác nhận
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full flex items-center gap-1 w-fit">
            <CheckCircle className="w-3.5 h-3.5" /> Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-full flex items-center gap-1 w-fit">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Trang Vận Hành Phòng Khám
          </div>
          <h1 className="text-3xl font-extrabold text-white">Quản Lý Đặt Lịch Trị Liệu</h1>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới dữ liệu
        </button>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
          }}
          className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-semibold text-sm rounded-xl flex items-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>

      {/* Status Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Tất cả đơn" },
          { key: "pending", label: "Chờ xác nhận" },
          { key: "confirmed", label: "Đã xác nhận" },
          { key: "completed", label: "Hoàn thành" },
          { key: "cancelled", label: "Đã hủy" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusFilter === tab.key
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Inbox className="w-12 h-12 text-slate-700 mx-auto" />
          <p className="text-slate-400 font-medium">Chưa có đơn đặt lịch nào thuộc trạng thái này.</p>
          <p className="text-slate-600 text-xs">Khách hàng đặt lịch qua trang /booking sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Mã & Thời gian đặt</th>
                  <th className="px-6 py-4">Khách hàng & SĐT</th>
                  <th className="px-6 py-4">Dịch vụ & KTV</th>
                  <th className="px-6 py-4">Ngày & Giờ làm</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.map((bk) => {
                  const cleanPhone = bk.customerPhone.replace(/\D/g, "");
                  const zaloUrl = `https://zalo.me/${cleanPhone}`;

                  return (
                    <tr key={bk.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        {bk.id}
                        <div className="text-xs font-sans text-slate-500 font-normal mt-0.5">
                          {new Date(bk.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{bk.customerName}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-400" /> {bk.customerPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-200">{getServiceName(bk.serviceId)}</div>
                        <div className="text-xs text-emerald-400 mt-0.5">
                          KTV: {getTherapistName(bk.therapistId)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-white font-medium">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {bk.date}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-300 font-mono mt-0.5">
                          <Clock className="w-3.5 h-3.5" /> {bk.startTime} – {bk.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4">{renderStatusBadge(bk.status)}</td>
                      <td className="px-6 py-4 text-right space-y-2">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={zaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                            title="Mở Zalo nhắn tin trực tiếp với khách"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Chat Zalo
                          </a>

                          {bk.status === "pending" && (
                            <button
                              disabled={updatingId === bk.id}
                              onClick={() => handleUpdateStatus(bk.id, "confirmed")}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                            >
                              Duyệt
                            </button>
                          )}
                          {bk.status === "confirmed" && (
                            <button
                              disabled={updatingId === bk.id}
                              onClick={() => handleUpdateStatus(bk.id, "completed")}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition"
                            >
                              Hoàn thành
                            </button>
                          )}
                          {bk.status !== "cancelled" && bk.status !== "completed" && (
                            <button
                              disabled={updatingId === bk.id}
                              onClick={() => handleUpdateStatus(bk.id, "cancelled")}
                              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-lg text-xs font-bold transition"
                            >
                              Hủy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
