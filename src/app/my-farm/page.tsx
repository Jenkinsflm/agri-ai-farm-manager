import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { BottomNav } from "@/components/layout/BottomNav";
import { ArrowLeft, PlusCircle, Trees, Layers, Droplets } from "lucide-react";

export default async function MyFarmPage() {
  const cookieStore = cookies();
  const demoUserId = cookieStore.get("demo_user")?.value;

  if (!demoUserId) {
    redirect("/login");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: farm } = await supabase.from("farms").select("*").eq("farmer_id", demoUserId).single();
  const { data: landUnits } = await supabase
    .from("land_units")
    .select("*, crops(*, crop_cycles(*), orchard_details(*))")
    .eq("farm_id", farm?.id);

  const fields = landUnits?.filter((u) => u.land_type === "field") || [];
  const orchards = landUnits?.filter((u) => u.land_type === "orchard") || [];

  return (
    <main className="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto font-sans px-4 pt-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>హోమ్</span>
        </Link>
        <Link
          href="/onboarding"
          className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-700 px-3.5 py-1.5 rounded-full shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>పంట చేర్చండి</span>
        </Link>
      </div>

      {/* Farm Overview Header */}
      <div className="bg-emerald-800 text-white p-5 rounded-3xl mb-6 shadow-sm">
        <span className="text-xs text-emerald-200 font-medium">వ్యవసాయ క్షేత్ర సమాచారం</span>
        <h1 className="text-xl font-black">{farm?.farm_name || "రమేష్ ఫార్మ్స్"}</h1>
        <p className="text-xs text-emerald-100">{farm?.village}, {farm?.district}</p>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-700/60">
          <div>
            <p className="text-[11px] text-emerald-200">మొత్తం విస్తీర్ణం</p>
            <p className="text-lg font-black">{farm?.total_land_acres} ఎకరాలు</p>
          </div>
          <div>
            <p className="text-[11px] text-emerald-200">మొత్తం విభాగాలు</p>
            <p className="text-lg font-black">{landUnits?.length || 0} యూనిట్లు</p>
          </div>
        </div>
      </div>

      {/* Section 1: Orchards (తోటలు) */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Trees className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900">తోటలు (Fruit Orchards)</h2>
          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full ml-auto">
            {orchards.length} తోటలు
          </span>
        </div>

        <div className="space-y-3">
          {orchards.map((orchard) => {
            const crop = orchard.crops?.[0];
            const details = crop?.orchard_details?.[0];
            const cycle = crop?.crop_cycles?.[0];
            const emoji = crop?.crop_name === "mosambi" ? "🍊" : "❤️";

            return (
              <div key={orchard.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{orchard.name}</h3>
                      <p className="text-xs text-slate-500 capitalize">{crop?.crop_name} • {crop?.variety}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                    {cycle?.current_stage || "Active"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500">విస్తీర్ణం</p>
                    <p className="text-xs font-bold text-slate-800">{orchard.area_acres} ఎకరాలు</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500">చెట్లు</p>
                    <p className="text-xs font-bold text-slate-800">{details?.number_of_trees || "100+"}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500">వయస్సు</p>
                    <p className="text-xs font-bold text-slate-800">{details?.tree_age_years || "3"} సం.</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Seasonal Fields (చేన్లు) */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-amber-700" />
          <h2 className="text-sm font-bold text-slate-900">పొలాలు (Seasonal Crop Fields)</h2>
          <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full ml-auto">
            {fields.length} చేన్లు
          </span>
        </div>

        <div className="space-y-3">
          {fields.map((field) => {
            const crop = field.crops?.[0];
            const cycle = crop?.crop_cycles?.[0];

            return (
              <div key={field.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🥜</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{field.name}</h3>
                      <p className="text-xs text-slate-500 capitalize">{crop?.crop_name} • {crop?.variety}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {cycle?.current_stage || "Active"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500">విస్తీర్ణం</p>
                    <p className="text-xs font-bold text-slate-800">{field.area_acres} ఎకరాలు</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500">వయస్సు</p>
                    <p className="text-xs font-bold text-slate-800">{cycle?.crop_age_days || "40+"} రోజులు</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-500">నీరు</p>
                    <p className="text-xs font-bold text-slate-800 capitalize">{field.irrigation_type}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
