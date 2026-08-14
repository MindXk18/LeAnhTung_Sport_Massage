"use client";

import Link from "next/link";
import { Activity, Calendar, BookOpen, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-emerald-400 hover:opacity-90 transition">
          <Activity className="w-7 h-7 text-emerald-500 animate-pulse" />
          <span>SPORT <span className="text-white font-normal">MASSAGE</span></span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">MVP</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-6 text-sm font-medium">
          <Link href="/booking" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-900/20 transition">
            <Calendar className="w-4 h-4" />
            <span>Đặt lịch ngay</span>
          </Link>

          <Link href="/programs" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Thư viện Bài tập</span>
          </Link>

          <Link href="/admin/bookings" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Quản trị</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
