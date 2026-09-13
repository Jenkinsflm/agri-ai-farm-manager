"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function createCropWithLandUnit(formData: FormData) {
  const cookieStore = cookies();
  const farmerId = cookieStore.get("demo_user")?.value || "00000000-0000-0000-0000-000000000001";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch farmer's active farm
  const { data: farm } = await supabase
    .from("farms")
    .select("id")
    .eq("farmer_id", farmerId)
    .single();

  const farmId = farm?.id;
  if (!farmId) {
    throw new Error("No active farm found for this farmer.");
  }

  const cropName = formData.get("crop_name") as string;
  const landType = cropName === "groundnut" ? "field" : "orchard";
  const cropType = cropName === "groundnut" ? "field_crop" : "fruit_orchard";
  const unitName = formData.get("unit_name") as string;
  const areaAcres = parseFloat(formData.get("area_acres") as string) || 1.0;
  const irrigationType = formData.get("irrigation_type") as string || "drip";
  const soilType = (formData.get("soil_type") as string) || "red_sandy_loam";
  const variety = formData.get("variety") as string;

  // 1. Insert into land_units table
  const { data: landUnit, error: landError } = await supabase
    .from("land_units")
    .insert({
      farm_id: farmId,
      name: unitName,
      land_type: landType,
      area_acres: areaAcres,
      irrigation_type: irrigationType,
      soil_type: soilType,
    })
    .select()
    .single();

  if (landError || !landUnit) {
    throw new Error(landError?.message || "Failed to create land unit.");
  }

  // 2. Insert into crops table
  const { data: crop, error: cropError } = await supabase
    .from("crops")
    .insert({
      land_unit_id: landUnit.id,
      crop_name: cropName,
      crop_type: cropType,
      variety: variety,
      area_acres: areaAcres,
      status: "active",
    })
    .select()
    .single();

  if (cropError || !crop) {
    throw new Error(cropError?.message || "Failed to create crop.");
  }

  // 3. Handle Crop Specific Cycles & Orchard Details
  if (cropName === "groundnut") {
    const sowingDateStr = formData.get("sowing_date") as string;
    const sowingDate = sowingDateStr ? new Date(sowingDateStr) : new Date();
    const diffDays = Math.max(0, Math.floor((new Date().getTime() - sowingDate.getTime()) / (1000 * 3600 * 24)));

    let stage = "Sowing";
    if (diffDays >= 1 && diffDays <= 10) stage = "Germination";
    else if (diffDays > 10 && diffDays <= 30) stage = "Vegetative Growth";
    else if (diffDays > 30 && diffDays <= 50) stage = "Flowering";
    else if (diffDays > 50 && diffDays <= 70) stage = "Pegging";
    else if (diffDays > 70 && diffDays <= 100) stage = "Pod Development";
    else if (diffDays > 100 && diffDays <= 120) stage = "Maturity";
    else if (diffDays > 120) stage = "Harvest";

    await supabase.from("crop_cycles").insert({
      crop_id: crop.id,
      cycle_name: "Kharif",
      sowing_date: sowingDateStr,
      start_date: sowingDateStr,
      crop_age_days: diffDays,
      current_stage: stage,
      cycle_status: "active",
    });

    await supabase.from("daily_tasks").insert({
      farmer_id: farmerId,
      farm_id: farmId,
      crop_id: crop.id,
      title: "Inspect newly registered Groundnut field",
      description: `Field ${unitName} registered at ${diffDays} days old (${stage}). Check soil moisture and weed presence.`,
      priority: "medium",
      status: "pending",
      generated_by: "system",
    });

  } else {
    const treeAge = parseFloat(formData.get("tree_age_years") as string) || 3.0;
    const numberOfTrees = parseInt(formData.get("number_of_trees") as string, 10) || 100;
    const spacing = (formData.get("spacing") as string) || "6m x 6m";
    const currentStage = (formData.get("current_stage") as string) || "Flowering";

    await supabase.from("orchard_details").insert({
      crop_id: crop.id,
      tree_age_years: treeAge,
      number_of_trees: numberOfTrees,
      spacing: spacing,
      irrigation_type: irrigationType,
    });

    await supabase.from("crop_cycles").insert({
      crop_id: crop.id,
      cycle_name: `${cropName.toUpperCase()} Cycle`,
      start_date: new Date().toISOString().split("T")[0],
      tree_age_years: treeAge,
      current_stage: currentStage,
      cycle_status: "active",
    });

    await supabase.from("daily_tasks").insert({
      farmer_id: farmerId,
      farm_id: farmId,
      crop_id: crop.id,
      title: `Inspect ${unitName} (${cropName})`,
      description: `Orchard verified at ${treeAge} years old. Inspect drip laterals and tree canopies for ${currentStage} stage health.`,
      priority: "medium",
      status: "pending",
      generated_by: "system",
    });
  }

  // 4. Log event in farm history ledger
  await supabase.from("farm_events").insert({
    farmer_id: farmerId,
    farm_id: farmId,
    crop_id: crop.id,
    event_type: "crop_created",
    title: `Added ${cropName.toUpperCase()} (${unitName})`,
    description: `Farmer registered ${areaAcres} acres of ${cropName}.`,
    metadata: { variety, area: areaAcres },
  });

  revalidatePath("/", "layout");
  redirect("/");
}
