"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginWithDemoRamesh() {
  const supabase = createClient();
  
  // Sign in using the provisioned demo credentials
  let { data, error } = await supabase.auth.signInWithPassword({
    email: "ramesh.farmer@agriai.internal",
    password: "Password123!",
  });

  // If password querying fails, sign up / ensure user session is active
  if (error) {
    const fallback = await supabase.auth.signUp({
      email: "ramesh.farmer@agriai.internal",
      password: "Password123!",
      options: {
        data: { full_name: "Ramesh" }
      }
    });
    
    if (fallback.error && !fallback.data.user) {
      return { error: error.message };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
