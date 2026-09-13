"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const nextStatus = currentStatus === "completed" ? "pending" : "completed";
  const completedAt = nextStatus === "completed" ? new Date().toISOString() : null;

  await supabase
    .from("daily_tasks")
    .update({ status: nextStatus, completed_at: completedAt })
    .eq("id", taskId);

  revalidatePath("/", "layout");
}
