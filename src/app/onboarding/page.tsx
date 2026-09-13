"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sprout, Sparkles } from "lucide-react";
import { createCropWithLandUnit } from "@/features/crop/actions";

type CropChoice = "groundnut" | "mosambi" | "pomegranate";

export default function OnboardingPage() {
  const [lang, setLang] = useState<"en" | "te">("te");
  const [selectedCrop, setSelectedCrop] = useState<CropChoice>("groundnut");
  const [sowingDate, setSowingDate] = useState(
    new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatic calculation for groundnut age & stage preview
  const getGroundnutCalculation = () => {
    if (!sowingDate) return { age: 0, stage: "Sowing" };
    const diff = Math.max(
      0,
      Math.floor((new Date().getTime() - new Date(sowingDate).getTime()) / (1000 * 3600 * 24))
    );
    let st = "Sowing (విత్తనం)";
    if (diff >= 1 && diff <= 10) st = "Germination (మొలక దశ)";
    else if (diff > 10 && diff <= 30) st = "Vegetative (శాకీయ ఎదుగుదల)";
    else if (diff > 30 && diff <= 50) st = "Flowering (పూత దశ)";
    else if (diff > 50 && diff <= 70) st = "Pegging (ఊడలు దిగే దశ)";
    else if (diff > 70 && diff <= 100) st = "Pod Development (కాయ అభివృద్ధి)";
    else if (diff > 100 && diff <= 120) st = "Maturity (పక్వత)";
    else if (diff > 120) st = "Harvest (కోత దశ)";
    return { age: diff, stage: st };
  };

  const groundnutCalc = getGroundnutCalculation();

  const t = {
    en: {
      back: "Back to Farm",
      title: "Add Field or Orchard",
      subtitle: "Sri Sathya Sai District • Adaptive Crop Profile",
      step1: "Select Crop Type",
      step2: "Enter Specifications",
      cropAreaLabel: "Area (Acres)",
      varietyLabel: "Variety",
      irrigationLabel: "Irrigation System",
      soilLabel: "Soil Type",
      submitBtn: "Save & Add to My Farm",
      submitting: "Saving Crop...",
      calculatedAge: "Calculated Age",
      calculatedStage: "Detected Crop Stage",
    },
    te: {
      back: "హోమ్‌కు తిరిగి వెళ్ళండి",
      title: "కొత్త పొలం లేదా తోటను చేర్చండి",
      subtitle: "శ్రీ సత్యసాయి జిల్లా • పంట వివరాల నమోదు",
      step1: "పంట రకాన్ని ఎంచుకోండి",
      step2: "నిర్దిష్ట వివరాలు నమోదు చేయండి",
      cropAreaLabel: "విస్తీర్ణం (ఎకరాల్లో)",
      varietyLabel: "రకం / విత్తనం",
      irrigationLabel: "నీటి పారుదల పద్ధతి",
      soilLabel: "నేల స్వభావం",
      submitBtn: "పొలాన్ని భద్రపరచండి",
      submitting: "నమోదు అవుతోంది...",
      calculatedAge: "లెక్కింపబడిన పంట వయస్సు",
      calculatedStage: "ప్రస్తుత పంట దశ",
    },
  }[lang];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 max-w-md mx-auto font-sans pb-16">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </Link>
        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "te" : "en")}
          className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 shadow-sm"
        >
          {lang === "en" ? "తెలుగు" : "English"}
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-900">{t.title}</h1>
        <p className="text-xs text-emerald-800 font-medium">{t.subtitle}</p>
      </div>

      {/* Step 1: Crop Selection Cards */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
          {t.step1}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Groundnut */}
          <button
            type="button"
            onClick={() => setSelectedCrop("groundnut")}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative ${
              selectedCrop === "groundnut"
                ? "bg-amber-50/70 border-amber-600 shadow-sm ring-2 ring-amber-500/20"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="text-3xl mb-1">🥜</span>
            <span className="text-xs font-bold text-slate-900">Groundnut</span>
            <span className="text-[10px] text-slate-500">వేరుశనగ</span>
            {selectedCrop === "groundnut" && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
            )}
          </button>

          {/* Mosambi */}
          <button
            type="button"
            onClick={() => setSelectedCrop("mosambi")}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative ${
              selectedCrop === "mosambi"
                ? "bg-amber-50/70 border-amber-500 shadow-sm ring-2 ring-amber-400/20"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="text-3xl mb-1">🍊</span>
            <span className="text-xs font-bold text-slate-900">Mosambi</span>
            <span className="text-[10px] text-slate-500">బత్తాయి</span>
            {selectedCrop === "mosambi" && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
            )}
          </button>

          {/* Pomegranate */}
          <button
            type="button"
            onClick={() => setSelectedCrop("pomegranate")}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative ${
              selectedCrop === "pomegranate"
                ? "bg-rose-50/70 border-rose-600 shadow-sm ring-2 ring-rose-500/20"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="text-3xl mb-1">❤️</span>
            <span className="text-xs font-bold text-slate-900">Pomegranate</span>
            <span className="text-[10px] text-slate-500">దానిమ్మ</span>
            {selectedCrop === "pomegranate" && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Step 2: Dynamic Form */}
      <form
        action={async (formData) => {
          setIsSubmitting(true);
          await createCropWithLandUnit(formData);
        }}
        className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4"
      >
        <input type="hidden" name="crop_name" value={selectedCrop} />

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {selectedCrop === "groundnut" ? "పొలం పేరు (Field Name)" : "తోట పేరు (Orchard Name)"}
          </label>
          <input
            type="text"
            name="unit_name"
            required
            defaultValue={
              selectedCrop === "groundnut"
                ? "వెంకటాపురం పొలం 2"
                : selectedCrop === "mosambi"
                ? "కొత్త బత్తాయి తోట"
                : "దానిమ్మ బ్లాక్ B"
            }
            className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.cropAreaLabel}
            </label>
            <input
              type="number"
              step="0.5"
              name="area_acres"
              required
              defaultValue={selectedCrop === "groundnut" ? "3.0" : "2.0"}
              className="w-full h-11 px-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.varietyLabel}
            </label>
            <input
              type="text"
              name="variety"
              required
              defaultValue={
                selectedCrop === "groundnut"
                  ? "Kadiri-6 (K6)"
                  : selectedCrop === "mosambi"
                  ? "Sathgudi"
                  : "Bhagwa"
              }
              className="w-full h-11 px-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-medium"
            />
          </div>
        </div>

        {/* 🥜 GROUNDNUT-SPECIFIC INPUTS */}
        {selectedCrop === "groundnut" && (
          <div className="space-y-4 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                విత్తిన తేది (Sowing Date)
              </label>
              <input
                type="date"
                name="sowing_date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                required
                className="w-full h-11 px-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 font-medium"
              />
            </div>

            {/* Groundnut Stage Preview Card */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  {t.calculatedAge}: <strong className="text-slate-900">{groundnutCalc.age} Days</strong>
                </p>
                <p className="text-xs font-black text-amber-900 mt-0.5">
                  {groundnutCalc.stage}
                </p>
              </div>
              <span className="text-2xl">🌱</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.irrigationLabel}
                </label>
                <select
                  name="irrigation_type"
                  className="w-full h-11 px-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900"
                >
                  <option value="rainfed">వర్షాధారం (Rainfed)</option>
                  <option value="drip">డ్రిప్ (Drip)</option>
                  <option value="sprinkler">స్ప్రింక్లర్ (Sprinkler)</option>
                  <option value="borewell_flood">బోరు బావి (Flood)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.soilLabel}
                </label>
                <select
                  name="soil_type"
                  className="w-full h-11 px-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900"
                >
                  <option value="red_sandy_loam">ఎర్ర ఇసుక నేల (Red Sandy)</option>
                  <option value="black_cotton">నల్ల రేగడి (Black Cotton)</option>
                  <option value="red_clay_loam">ఎర్ర బంకమట్టి (Clay Loam)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 🍊 MOSAMBI & ❤️ POMEGRANATE ORCHARD SPECIFIC INPUTS */}
        {selectedCrop !== "groundnut" && (
          <div className="space-y-4 pt-1 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  చెట్ల వయస్సు (Tree Age)
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="tree_age_years"
                  required
                  defaultValue={selectedCrop === "mosambi" ? "4.0" : "3.0"}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  చెట్ల సంఖ్య (Number of Trees)
                </label>
                <input
                  type="number"
                  name="number_of_trees"
                  required
                  defaultValue={selectedCrop === "mosambi" ? "220" : "350"}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ప్రస్తుత దశ (Current Stage)
                </label>
                <select
                  name="current_stage"
                  className="w-full h-11 px-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                >
                  <option value="Flowering">పూత దశ (Flowering)</option>
                  <option value="Fruit Set">పిందె దశ (Fruit Set)</option>
                  <option value="Fruit Development">కాయ ఎదుగుదల (Fruit Dev)</option>
                  <option value="Vegetative">శాకీయ ఎదుగుదల (Vegetative)</option>
                  <option value="Maturity">పక్వత దశ (Maturity)</option>
                  <option value="Harvest">కోత దశ (Harvest)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  నాటే దూరం (Spacing)
                </label>
                <input
                  type="text"
                  name="spacing"
                  defaultValue={selectedCrop === "mosambi" ? "6m x 6m" : "4.5m x 3.5m"}
                  className="w-full h-11 px-3 text-xs rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.irrigationLabel}
              </label>
              <select
                name="irrigation_type"
                className="w-full h-11 px-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
              >
                <option value="drip">బిందు సేద్యం (Drip Irrigation)</option>
                <option value="basin">పాదుల పద్ధతి (Basin Flood)</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow transition-all disabled:opacity-75 pt-1"
        >
          <Sprout className="w-5 h-5" />
          <span>{isSubmitting ? t.submitting : t.submitBtn}</span>
        </button>
      </form>
    </main>
  );
}
