import { THICKNESS_OPTIONS } from "./Types";
import { GLAZING_SCHEMA } from "./const";
import { z } from "zod";

type GlazingType = z.infer<typeof GLAZING_SCHEMA>;

export function getAvailableThicknesses(glazing: GlazingType) {
  // 1. Laminated & Acoustic -> Strictly 28mm only
  if (glazing === "dg_laminated" || glazing === "dg_acoustic") {
    return THICKNESS_OPTIONS.filter((opt) => opt.value === 28.8);
  }

  // 2. Triple Glazing -> 32mm and 36mm only
  if (glazing === "tg_standard" || glazing === "tg_toughened") {
    return THICKNESS_OPTIONS.filter((opt) => opt.value >= 32);
  }

  // 3. Standard & Toughened Double Glazing -> Double glazing options (<= 28mm)
  return THICKNESS_OPTIONS.filter((opt) => opt.value <= 28);
}
