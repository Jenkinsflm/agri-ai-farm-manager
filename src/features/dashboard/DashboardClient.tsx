"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  PlusCircle, 
  LogOut, 
  AlertTriangle,
  Info,
  Calendar,
  Layers
} from "lucide-react";
import { toggleTaskStatus } from "./actions";

export default function DashboardClient({ 
  profile, 
  farm, 
  crops, 
  tasks,
  onLogout 
}: { 
  profile: any; 
  farm: any; 
  crops: any[]; 
  tasks: any[];
  onLogout: () => void;
}) {
  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || "");
  const [isPending, startTransition] = useTransition();

  const activeCrop = crops.find((c) => c.id === selectedCropId) || crops[0];
  const activeCycle = activeCrop?.crop_cycles?.[0];
  const cropTasks = tasks.filter((t) => t.crop_id === selectedCropId);

  // Dynamic advice context based on selected crop
  const getCropAdvisoryPriority = () => {
    if (!activeCrop) return { title: "పొలాన్ని పరిశీలించండి", reason: "దినచర్య" };
    if (activeCrop.crop_name === "groundnut") {
      return {
        title: "ఊడలు దిగే దశలో నేల తేమను పరిశీలించండి",
        reason: "వేరుశనగ పూత దశ నుండి ఊడలు నేలలోకి చొచ్చుకుపోయేందుకు పై 2 అంగుళాల మట్టిలో తగినంత తేమ తప్పనిసరి.",
        risk: "ఎర్ర ఇసుక నేలలో తేమ ఆరిపోతే కాయల సంఖ్య తగ్గే ప్రమాదం ఉంది."
      };
    } else if (activeCrop.crop_name === "mosambi") {
      return {
        title: "కాయ ఎదుగుదల సమయంలో సూక్ష్మ పోషకాలు & నీటి యాజమాన్యం",
        reason: "4 ఏళ్ల బత్తాయి చెట్లలో పిందెలు నాణ్యమైన కాయలుగా ఎదిగేందుకు క్రమబద్ధమైన డ్రిప్ తడులు అవసరం.",
        risk: "నీటి ఎద్దడి వస్తే కాయ పగుళ్లు లేదా పిందె రాలడం జరుగుతుంది."
      };
    } else {
      return {
        title: "పూత దశలో తామర పురుగుల (Thrips) ఉధృతిని గమనించండి",
        reason: "దానిమ్మ పూత మరియు పిందెలపై మచ్చలు రాకుండా కాపాడటానికి తెల్ల కాగితం పరీక్ష నిర్వహించండి.",
        risk: "తామర పురుగుల వల్ల కాయలపై గీతలు పడి మార్కెట్ విలువ దెబ్బతింటుంది."
      };
    }
  };

  const advisory = getCropAdvisoryPriority();

  return (
    <main className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto font-sans">
      {/* Header */}
      <header className="bg-emerald-800 text-white px-5 pt-8 pb-6 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs text-emerald-200">నమస్కారం / Welcome</span>
            <h1 className="text-xl font-bold">{profile?.full_name || "రమేష్"} 👨‍🌾</h1>
            <p className="text-xs text-emerald-100">{farm?.farm_name || "రమేష్ ఫార్మ్స్"} • {profile?.district}</p>
          </div>
          <button 
            type="button" 
            onClick={onLogout}
            className="p-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-600 active:scale-95 transition-all text-xs"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Farm Land Card */}
        <div className="bg-emerald-700/70 p-3.5 rounded-2xl flex items-center justify-between border border-emerald-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg">
              🌾
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-200">మొత్తం సాగు విస్తీర్ణం</p>
              <p className="text-base font-black">{farm?.total_land_acres || "10"} ఎకరాలు (Acres)</p>
            </div>
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-1 bg-white text-emerald-900 text-xs font-bold px-3 py-2 rounded-xl shadow-sm active:scale-95 transition-transform"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>పంట చేర్చండి</span>
          </Link>
        </div>
      </header>

      {/* Interactive Crop Selector Pills */}
      <section className="px-4 mt-5">
        <div className="flex justify-between items-center mb-2.5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            పంటను ఎంచుకోండి (Select Crop)
          </h2>
          <span className="text-[11px] font-semibold text-emerald-700">
            {crops.length} పంటలు అందుబాటులో ఉన్నాయి
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {crops.map((crop) => {
            const isSelected = crop.id === selectedCropId;
            const emoji = crop.crop_name === "groundnut" ? "🥜" : crop.crop_name === "mosambi" ? "🍊" : "❤️";
            const cycle = crop.crop_cycles?.[0];

            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => setSelectedCropId(crop.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-emerald-600 shadow-md ring-2 ring-emerald-600/10"
                    : "bg-white/70 border-slate-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{emoji}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 capitalize truncate">
                    {crop.crop_name}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {crop.area_acres} ఎకరాలు
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 truncate max-w-full">
                    {cycle?.current_stage || "Active"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Hero: Today on My Farm (Selected Crop Context) */}
      {activeCrop && (
        <section className="px-4 mt-5">
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-4 rounded-3xl border-2 border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {activeCrop.crop_name === "groundnut" ? "🥜" : activeCrop.crop_name === "mosambi" ? "🍊" : "❤️"}
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 capitalize">
                    {activeCrop.crop_name} • {activeCrop.variety || "Local"}
                  </h3>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    దశ: {activeCycle?.current_stage} {activeCycle?.crop_age_days ? `(${activeCycle.crop_age_days}వ రోజు)` : activeCycle?.tree_age_years ? `(${activeCycle.tree_age_years} సం. చెట్లు)` : ""}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                నేటి సూచన
              </span>
            </div>

            {/* Today's Priority */}
            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                నేటి ముఖ్యమైన పని (Today's Priority)
              </h4>
              <p className="text-xs font-bold text-emerald-950 mt-1 pl-3.5 leading-relaxed">
                {advisory.title}
              </p>
            </div>

            {/* Why This Matters */}
            <div className="mt-3 bg-white/80 p-3 rounded-2xl border border-emerald-100 text-xs">
              <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-0.5">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                ఇది ఎందుకు ముఖ్యం? (Why this matters)
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {advisory.reason}
              </p>
              {advisory.risk && (
                <p className="text-[10px] text-amber-800 mt-2 font-medium flex items-center gap-1 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                  <span>హెచ్చరిక: {advisory.risk}</span>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Crop-Specific Tasks Checklist */}
      <section className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              నేటి పనుల జాబితా (Daily Tasks)
            </h2>
            <p className="text-[11px] text-slate-500">పూర్తి చేసిన పనులపై టిక్ చేయండి</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            {cropTasks.length} పనులు
          </span>
        </div>

        <div className="space-y-2">
          {cropTasks.length === 0 ? (
            <div className="bg-white p-5 rounded-2xl border border-dashed border-slate-200 text-center">
              <p className="text-xs font-semibold text-slate-500">ఈ పంటకు ప్రస్తుతం పెండింగ్ పనులు లేవు.</p>
            </div>
          ) : (
            cropTasks.map((task) => {
              const isDone = task.status === "completed";
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      toggleTaskStatus(task.id, task.status);
                    });
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    isDone 
                      ? "bg-slate-100/70 border-slate-200 opacity-80" 
                      : "bg-white border-slate-200 shadow-sm hover:border-emerald-300"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${isDone ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                  {task.priority === "high" && !isDone && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 flex-shrink-0">
                      High
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
