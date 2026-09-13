import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, History, CheckCircle2, Bot, Stethoscope, Sprout, Calendar } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function FarmHistoryPage() {
  const cookieStore = cookies();
  const demoUserId = cookieStore.get("demo_user")?.value;

  if (!demoUserId) {
    redirect("/login");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: events } = await supabase
    .from("farm_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "ai_question":
        return <Bot className="w-5 h-5 text-blue-600" />;
      case "crop_analysis":
        return <Stethoscope className="w-5 h-5 text-rose-600" />;
      case "crop_created":
        return <Sprout className="w-5 h-5 text-amber-600" />;
      default:
        return <Calendar className="w-5 h-5 text-slate-500" />;
    }
  };

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
          <History className="w-3.5 h-3.5" />
          <span>ఫార్మ్ హిస్టరీ</span>
        </span>
      </div>

      <div className="bg-emerald-800 text-white p-5 rounded-3xl mb-5 shadow-sm">
        <h1 className="text-xl font-black">వ్యవసాయ దినచర్య రికార్డు</h1>
        <p className="text-xs text-emerald-100 mt-1">
          మీ వ్యవసాయ క్షేత్రంలో చేపట్టిన అన్ని పనులు, AI విశ్లేషణలు మరియు మార్పుల పూర్తి చరిత్ర.
        </p>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3">
        {events && events.length > 0 ? (
          events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 mt-0.5">
                {getEventIcon(ev.event_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {ev.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                    {new Date(ev.created_at).toLocaleDateString("te-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                  {ev.description || "వివరాలు నమోదు చేయబడ్డాయి"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
            ఇంకా ఎలాంటి రికార్డులు నమోదు కాలేదు.
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
