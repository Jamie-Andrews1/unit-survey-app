import { Accessor } from "solid-js";
import { GlazingType, SealedUnit, SpacerType, ThicknessSchema } from "./Types";

export const GLAZING_SCHEMA: Record<GlazingType, string> = {
  dg_standard: "Double Glazed - Standard",
  dg_toughened: "Double Glazed - Toughened",
  dg_laminated: "Double Glazed - Laminated",
  dg_acoustic: "Double Glazed - Acoustic",
  tg_standard: "Triple Glazed - Standard",
  tg_toughened: "Triple Glazed - Toughened",
};

export const GLAZING_OPTIONS = Object.entries(GLAZING_SCHEMA).map(
  ([value, label]) => ({
    value: value as GlazingType,
    label,
  }),
);

export const SPACER_SCHEMA: Record<SpacerType, string> = {
  silver: "Silver Aluminum",
  white: "White Warm-Edge",
  standard_black: "Standard Black (Warm-Edge)",
};

export const THICKNESS_SCHEMA: Record<SpacerType, string> = {
  silver: "Silver Aluminum",
  white: "White Warm-Edge",
  standard_black: "Standard Black (Warm-Edge)",
};

export const generateShareText = (surveys: Accessor<SealedUnit[]>) => {
  let text = "Sealed Unit Survey Report:\n\n";
  surveys().forEach((s, i) => {
    text += `${i + 1}. ${s.ref}: ${s.width} x ${s.height}mm (${s.thickness}mm) - ${GLAZING_SCHEMA[s.glazing]}\n - ${SPACER_SCHEMA[s.spacer]} spacer`;
  });
  return encodeURIComponent(text);
};
