import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import DashboardClient from "@/features/dashboard/DashboardClient";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function HomePage() {
  const cookieStore = cookies();
  const demoUserId = cookieStore.get("demo_user")?.value;

  if (!demoUserId) {
    redirect("/login");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", demoUserId).single();
  const { data: farm } = await supabase.from("farms").select("*").eq("farmer_id", demoUserId).single();
  const { data: crops } = await supabase.from("crops").select("*, crop_cycles(*)").order("created_at", { ascending: false });
  const { data: tasks } = await supabase.from("daily_tasks").select("*").eq("farmer_id", demoUserId).order("created_at", { ascending: false });

  async function handleLogout() {
    "use server";
    const c = cookies();
    c.delete("demo_user");
    redirect("/login");
  }

  return (
    <>
      <DashboardClient
        profile={profile}
        farm={farm}
        crops={crops || []}
        tasks={tasks || []}
        onLogout={handleLogout}
      />
      <BottomNav />
    </>
  );
}
