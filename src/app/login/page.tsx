"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "te">("te");
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      appName: "Agri AI Farm Manager",
      tagline: "Your Personal AI Farm Manager",
      subheading: "Sri Sathya Sai District, Andhra Pradesh",
      demoTitle: "Instant Demo Mode",
      demoDesc: "Enter as Farmer Ramesh (Groundnut, Mosambi & Pomegranate)",
      demoButton: "Enter Demo Farm as Ramesh",
      secureNotice: "Farmer data is strictly isolated and secured with Row Level Security."
    },
    te: {
      appName: "అగ్రి AI ఫార్మ్ మేనేజర్",
      tagline: "మీ వ్యక్తిగత AI వ్యవసాయ సహాయకుడు",
      subheading: "శ్రీ సత్యసాయి జిల్లా, ఆంధ్రప్రదేశ్",
      demoTitle: "డెమో ప్రవేశం (ఒక్క క్లిక్)",
      demoDesc: "రైతు రమేష్ ఖాతాతో పరిశీలించండి (వేరుశనగ, బత్తాయి & దానిమ్మ)",
      demoButton: "రమేష్ డెమో ఫారమ్‌లోకి వెళ్ళండి",
      secureNotice: "రైతుల వివరాలు భద్రపరచబడినవి మరియు సురక్షితమైనవి."
    }
  }[lang];

  const handleDemo = () => {
    setLoading(true);
    // Set demo cookie so the server knows Ramesh is active
    document.cookie = "demo_user=00000000-0000-0000-0000-000000000001; path=/; max-age=86400";
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-8 max-w-md mx-auto font-sans">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "te" : "en")}
          className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm"
        >
          {lang === "en" ? "తెలుగులోకి మార్చండి" : "Switch to English"}
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow">
          <Sprout className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">{t.appName}</h1>
        <p className="text-sm font-semibold text-emerald-700 mt-0.5">{t.tagline}</p>
        <span className="inline-block mt-2 text-xs text-slate-500 bg-slate-200/70 px-3 py-0.5 rounded-full">
          {t.subheading}
        </span>
      </div>

      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t.demoTitle}</span>
        </div>
        <p className="text-xs text-slate-600 mb-4">{t.demoDesc}</p>
        <button
          type="button"
          onClick={handleDemo}
          disabled={loading}
          className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-all disabled:opacity-75"
        >
          <span>{loading ? "ప్రవేశిస్తోంది..." : t.demoButton}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>{t.secureNotice}</span>
      </div>
    </main>
  );
}
