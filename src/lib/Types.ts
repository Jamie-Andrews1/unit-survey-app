export type SpacerType = "silver" | "white" | "standard_black"; // standard is usually black in the industry
export type GlazingType =
  | "dg_standard"
  | "dg_toughened"
  | "dg_laminated"
  | "dg_acoustic"
  | "tg_standard"
  | "tg_toughened";

export interface SealedUnit {
  id: number;
  ref: string;
  width: number;
  height: number;
  thickness: number;
  glazing: GlazingType;
  spacer: SpacerType;
}
