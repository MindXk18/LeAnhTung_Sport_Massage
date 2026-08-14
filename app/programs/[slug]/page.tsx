"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Program } from "@/lib/types";
import { PageLoadingSpinner } from "@/components/shared/LoadingSkeleton";
import { ArrowLeft, PlayCircle, Clock, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgram() {
      try {
        const res = await fetch("/api/programs");
        const json = await res.json();
        if (json.success) {
          const found = json.data.find((p: Program) => p.slug === slug);
          setProgram(found || null);
          // Auto-open first lesson
          if (found && found.lessons.length > 0) {
            setOpenLessonId(found.lessons[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch program", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgram();
  }, [slug]);

  if (loading) {
    return <PageLoadingSpinner text="Đang tải chương trình..." />;
  }

  if (!program) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Không tìm thấy chương trình</h1>
        <p className="text-slate-400">Chương trình bạn tìm không tồn tại hoặc đã bị gỡ.</p>
        <Link href="/programs" className="inline-block px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl">
          Quay lại thư viện
        </Link>
      </div>
    );
  }

  const toggleLesson = (lessonId: string) => {
    setOpenLessonId((prev) => (prev === lessonId ? null : lessonId));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div>
        <Link href="/programs" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Quay lại thư viện bài tập
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {program.issueTags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{program.title}</h1>
        <p className="mt-3 text-slate-300 text-base leading-relaxed">{program.description}</p>
      </div>

      {/* Video Lessons Accordion */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
          <BookOpen className="w-6 h-6 text-emerald-400" /> Danh Sách Bài Tập Video ({program.lessons.length} Bài)
        </h2>

        <div className="space-y-3">
          {program.lessons.map((lesson) => {
            const isOpen = openLessonId === lesson.id;

            return (
              <div key={lesson.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className={`w-full px-6 py-5 flex items-center justify-between text-left transition ${
                    isOpen ? "bg-emerald-950/30 border-b border-emerald-500/20" : "hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition ${
                      isOpen
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {lesson.order}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg transition ${isOpen ? "text-emerald-400" : "text-white"}`}>
                        {lesson.title}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} phút
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOpen ? (
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                        Đang xem
                      </span>
                    ) : (
                      <PlayCircle className="w-5 h-5 text-slate-400" />
                    )}
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </button>

                {/* Accordion Content — YouTube Embed */}
                {isOpen && (
                  <div className="p-4 sm:p-6">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${lesson.youtubeVideoId}`}
                        title={lesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Bạn cần được hỗ trợ trị liệu chuyên sâu?</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Đặt lịch ngay với đội ngũ 5 chuyên gia KTV của chúng tôi để được thăm khám và trực tiếp phục hồi chấn thương.
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
        >
          <PlayCircle className="w-5 h-5" /> Đặt lịch trị liệu ngay
        </Link>
      </div>
    </div>
  );
}
