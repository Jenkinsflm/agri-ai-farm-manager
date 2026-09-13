"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";
import { groundnutStages } from "@/config/crops/groundnut";
import { BottomNav } from "@/components/layout/BottomNav";

export default function CropCalendarPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>("groundnut");
  const currentAgeDays = 42; // Ramesh's groundnut crop age

  return (
    <main className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto font-sans px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>హోమ్</span>
        </Link>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>పంట క్యాలెండర్</span>
        </span>
      </div>

      <div className="bg-emerald-800 text-white p-5 rounded-3xl mb-5 shadow-sm">
        <h1 className="text-xl font-black">పంట దశల కాలక్రమం</h1>
        <p className="text-xs text-emerald-100 mt-1">
          విత్తిన నాటి నుండి పంట కోత వరకు ప్రతీ దశలో తీసుకోవాల్సిన జాగ్రత్తలు.
        </p>

        <div className="flex gap-2 mt-4 pt-3 border-t border-emerald-700/60 overflow-x-auto">
          {[
            { id: "groundnut", name: "వేరుశనగ (42 రోజులు)", emoji: "🥜" },
            { id: "mosambi", name: "బత్తాయి (4 సం.)", emoji: "🍊" },
            { id: "pomegranate", name: "దానిమ్మ (3 సం.)", emoji: "❤️" },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCrop(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCrop === c.id
                  ? "bg-white text-emerald-900 shadow-sm"
                  : "bg-emerald-700 text-emerald-100"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Groundnut Stage Stepper */}
      {selectedCrop === "groundnut" && (
        <div className="space-y-4">
          {groundnutStages.map((st, idx) => {
            const isPassed = currentAgeDays > st.dayEnd;
            const isCurrent = currentAgeDays >= st.dayStart && currentAgeDays <= st.dayEnd;

            return (
              <div
                key={st.id}
                className={`p-4 rounded-3xl border transition-all ${
                  isCurrent
                    ? "bg-gradient-to-br from-emerald-50 to-teal-50/60 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/10"
                    : isPassed
                    ? "bg-white border-slate-200 opacity-90"
                    : "bg-white/60 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                        ✓
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {st.nameTe}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {st.dayStart} - {st.dayEnd} రోజులు
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-emerald-700 text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      ప్రస్తుత దశ
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-700">ముఖ్యమైన పనులు:</p>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {st.activitiesTe.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>

                  <p className="text-[11px] font-bold text-slate-700 pt-1">గమనించాల్సిన అంశాలు:</p>
                  <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                    {st.monitoringTe.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedCrop !== "groundnut" && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 text-center space-y-2">
          <span className="text-3xl">🌳</span>
          <h3 className="text-sm font-bold text-slate-900">బహువార్షిక తోట క్యాలెండర్ (Perennial Orchard)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            బత్తాయి మరియు దానిమ్మ తోటలు బహార్ (Bahar) నిర్వహణ, పూత కత్తిరింపులు మరియు కాయ పరిమాణం ఆధారంగా నిర్వహించబడతాయి. ప్రస్తుత దశ: <strong>కాయ ఎదుగుదల (Fruit Development)</strong>.
          </p>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
