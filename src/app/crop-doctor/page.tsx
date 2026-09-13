"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Stethoscope, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw,
  SearchCheck
} from "lucide-react";
import { analyzeCropPhoto, DiagnosisResult } from "@/features/crop-doctor/actions";
import { BottomNav } from "@/components/layout/BottomNav";

export default function CropDoctorPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>("groundnut");
  const [notes, setNotes] = useState("");
  const [previewImage, setPreviewImage] = useState<string>(
    "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // Handle local mock photo upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setResult(null);
    }
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeCropPhoto(selectedCrop, notes, previewImage);
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-28 max-w-md mx-auto font-sans px-4 pt-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>హోమ్</span>
        </Link>
        <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
          <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
          <span>AI క్రాప్ డాక్టర్</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-emerald-800 text-white p-5 rounded-3xl mb-5 shadow-sm">
        <h1 className="text-xl font-black flex items-center gap-2">
          <span>పంట రోగ నిర్ధారణ</span>
          <span className="text-xl">📸</span>
        </h1>
        <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
          ఆకులు, కాయలు లేదా కాండం ఫోటో తీయండి. AI ప్రాథమిక అంచనాను మరియు వెంటనే చేయాల్సిన పనులను అందిస్తుంది.
        </p>
      </div>

      {/* Crop Selector */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
          పంటను ఎంచుకోండి (Select Affected Crop)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "groundnut", name: "వేరుశనగ", emoji: "🥜" },
            { id: "mosambi", name: "బత్తాయి", emoji: "🍊" },
            { id: "pomegranate", name: "దానిమ్మ", emoji: "❤️" },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedCrop(c.id);
                setResult(null);
              }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                selectedCrop === c.id
                  ? "bg-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/20"
                  : "bg-white/70 border-slate-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl mb-1">{c.emoji}</span>
              <span className="text-xs font-bold text-slate-900">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload Box */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-4">
        <label className="block text-xs font-bold text-slate-700 mb-2">
          పంట ఫోటోను అప్‌లోడ్ చేయండి (Upload Leaf/Fruit Photo)
        </label>
        
        <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-2 flex flex-col items-center justify-center min-h-[190px]">
          {previewImage ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Selected crop preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <label
                htmlFor="photo-upload"
                className="absolute bottom-3 right-3 bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 hover:bg-white"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>మార్చండి</span>
              </label>
            </div>
          ) : (
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center cursor-pointer p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-2">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">ఫోటో తీయండి లేదా ఎంచుకోండి</p>
              <p className="text-[10px] text-slate-500 mt-0.5">JPEG, PNG ఫైల్స్ సపోర్ట్ చేయబడతాయి</p>
            </label>
          )}

          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Farmer Observations Text */}
        <div className="mt-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            మీరు గమనించిన వివరాలు (Optional Description)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ఉదా: ఆకులపై పసుపు మచ్చలు 3 రోజుల నుంచి ఉన్నాయి..."
            className="w-full h-11 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
          />
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          className="w-full h-12 mt-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow transition-all disabled:opacity-75"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI పరిశీలిస్తోంది...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>పంట ఆరోగ్యాన్ని విశ్లేషించండి (Diagnose)</span>
            </>
          )}
        </button>
      </div>

      {/* Diagnosis Results Card */}
      {result && (
        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-300 shadow-md space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                ప్రాథమిక AI నిర్ధారణ (Preliminary)
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-1.5 leading-snug">
                {result.possibleIssue}
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                result.severity === "high"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              తీవ్రత: {result.severity.toUpperCase()}
            </span>
          </div>

          {/* Observed Card */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <SearchCheck className="w-4 h-4 text-emerald-700" />
              AI ఏమి గమనించింది? (What AI Observed)
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {result.whatAiObserved}
            </p>
          </div>

          {/* Verification check */}
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              పొలంలో నిర్ధారించుకోవాల్సిన అంశం (Field Verification)
            </h4>
            <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
              {result.fieldVerificationCheck}
            </p>
          </div>

          {/* Next Steps */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-1.5">
              💡 సిఫార్సు చేసిన యాజమాన్య చర్యలు (Recommended Next Steps):
            </h4>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              {result.recommendedAction}
            </div>
          </div>

          {/* Expert Warning */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>అధికారులను ఎప్పుడు సంప్రదించాలి?</span>
            </div>
            <p className="leading-relaxed">{result.expertConsultationGuide}</p>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="text-[10px] text-slate-400 text-center italic pt-2 border-t border-slate-100">
            {result.disclaimer}
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
