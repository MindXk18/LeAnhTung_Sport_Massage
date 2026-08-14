"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Program } from "@/lib/types";
import { PageLoadingSpinner } from "@/components/shared/LoadingSkeleton";
import { PlayCircle, ArrowRight, BookOpen, Filter, Inbox } from "lucide-react";

// Tag labels in Vietnamese for display
const TAG_LABELS: Record<string, string> = {
  "vai-gay": "Vai Gáy",
  "dau-lung": "Đau Lưng",
  "dau-goi": "Đau Gối",
  "co-dui": "Căng Cơ Đùi",
  "phuc-hoi-toan-than": "Phục Hồi Toàn Thân",
  "co-chan": "Cổ Chân",
  "cot-song": "Cột Sống",
  "chay-bo": "Dành Cho Runner",
  "gym": "Dành Cho Gym",
  "stretching": "Giãn Cơ Tổng Hợp",
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("all");

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/programs");
        const json = await res.json();
        if (json.success) setPrograms(json.data);
      } catch (err) {
        console.error("Failed to fetch programs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  // Collect all unique tags from programs
  const allTags = Array.from(
    new Set(programs.flatMap((p) => p.issueTags))
  );

  const filteredPrograms =
    activeTag === "all"
      ? programs
      : programs.filter((p) => p.issueTags.includes(activeTag));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" /> Thư viện E-Learning Dành Cho Khách Hàng
        </div>
        <h1 className="text-4xl font-extrabold text-white">Chương Trình Tập Tự Phục Hồi Tại Nhà</h1>
        <p className="text-slate-400 text-base">
          Video hướng dẫn tự tập giãn cơ, phòng ngừa chấn thương &amp; tăng cường sức khỏe cột sống chuẩn y khoa được biên soạn bởi các chuyên gia trị liệu Sport Massage.
        </p>
      </div>

      {/* Filter Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          <button
            onClick={() => setActiveTag("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTag === "all"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTag === tag
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              #{TAG_LABELS[tag] || tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <PageLoadingSpinner text="Đang tải chương trình bài tập..." />
      ) : filteredPrograms.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <Inbox className="w-12 h-12 text-slate-700 mx-auto" />
          <p className="text-slate-400 font-medium">Chưa có chương trình nào cho tag này.</p>
          <button onClick={() => setActiveTag("all")} className="text-emerald-400 text-sm hover:underline">
            ← Xem tất cả chương trình
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={prog.thumbnailUrl || ""}
                    alt={prog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 font-extrabold text-xs">
                    {prog.lessons.length} Bài học video
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {prog.issueTags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                        #{TAG_LABELS[tag] || tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">{prog.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{prog.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/programs/${prog.slug}`}
                  className="w-full py-3.5 bg-slate-800 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition group-hover:bg-emerald-500 group-hover:text-slate-950"
                >
                  <PlayCircle className="w-4 h-4" /> Bắt đầu xem ngay bài tập <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
