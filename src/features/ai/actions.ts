"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { askAgriAI } from "@/services/ai/aiService";
import { FarmerContextData } from "@/services/ai/contextBuilder";

export async function submitFarmerQuestion(cropId: string, question: string) {
  const cookieStore = cookies();
  const demoUserId = cookieStore.get("demo_user")?.value || "00000000-0000-0000-0000-000000000001";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", demoUserId).single();
  const { data: farm } = await supabase.from("farms").select("*").eq("farmer_id", demoUserId).single();
  const { data: crop } = await supabase.from("crops").select("*, land_units(*), crop_cycles(*)").eq("id", cropId).single();

  const cycle = crop?.crop_cycles?.[0];
  const landUnit = crop?.land_units;

  const contextData: FarmerContextData = {
    farmer: {
      name: profile?.full_name || "రమేష్",
      village: profile?.village || "బత్తలపల్లి",
      district: profile?.district || "శ్రీ సత్యసాయి జిల్లా",
      state: "Andhra Pradesh",
      language: profile?.preferred_language || "te",
    },
    farm: {
      name: farm?.farm_name || "రమేష్ ఫార్మ్స్",
      totalAcres: Number(farm?.total_land_acres) || 10,
    },
    crop: crop ? {
      name: crop.crop_name,
      type: crop.crop_type,
      variety: crop.variety || "Local",
      areaAcres: Number(crop.area_acres),
      soilType: landUnit?.soil_type,
      irrigationType: landUnit?.irrigation_type,
      stage: cycle?.current_stage,
      cropAgeDays: cycle?.crop_age_days,
      treeAgeYears: cycle?.tree_age_years,
    } : undefined,
  };

  const answer = await askAgriAI(question, contextData);

  // Store in farm events ledger
  await supabase.from("farm_events").insert({
    farmer_id: demoUserId,
    farm_id: farm?.id,
    crop_id: cropId || null,
    event_type: "ai_question",
    title: "Asked Agri AI",
    description: question,
    metadata: { answer_preview: answer.slice(0, 100) },
  });

  return { answer };
}
