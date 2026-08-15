import { z } from "zod";

export type PrivacyLevel = 1 | 2 | 3 | 4 | 5;

export interface GlassPattern {
  id: string;
  name: string;
  level: PrivacyLevel;
  description: string;
  isActive: boolean;
}

export const PatternSchema = z
  .object({
    hasPattern: z.boolean(),
    patternId: z.string().optional(),
  })
  .refine((data) => !data.hasPattern || (data.hasPattern && !!data.patternId), {
    message: "Please select a pattern type",
    path: ["patternId"],
  });

const SpacerSchema = z.enum(["silver", "white", "standard_black"]);

const GlazingSchema = z.enum([
  "dg_standard",
  "dg_toughened",
  "dg_laminated",
  "dg_acoustic",
  "tg_standard",
  "tg_toughened",
]);

export const THICKNESS_OPTIONS = [
  { value: 14, label: "14mm (4/6/4)" },
  { value: 16, label: "16mm (4/8/4)" },
  { value: 18, label: "18mm (4/10/4)" },
  { value: 20, label: "20mm (4/12/4)" },
  { value: 24, label: "24mm (4/16/4)" },
  { value: 28, label: "28mm (4/20/4) Most Common" },
  { value: 28.8, label: "28.8mm (6.8/18/4) Laminated/Acoustic" },
  { value: 32, label: "32mm (4/10/4/10/4)" },
  { value: 36, label: "36mm (4/12/4/12/4) High Performance" },
] as const;

const thicknessValues = THICKNESS_OPTIONS.map((opt) => opt.value) as [
  number,
  ...number[],
];

export const ThicknessSchema = z.coerce
  .number()
  .refine((val) => thicknessValues.includes(val), {
    message: "Invalid thickness selected",
  });

export const UnitSchema = z
  .object({
    id: z.number(),
    ref: z.string().min(1, "Reference is required"),
    width: z.coerce
      .number()
      .min(100, "Too small, must be 100mm or greater")
      .max(4000, "Too wide, 4000mm max"),
    height: z.coerce
      .number()
      .min(100, "Too small, must be 100mm or greater")
      .max(4000, "Too high, 4000mm max"),
    thickness: ThicknessSchema,
    glazing: GlazingSchema,
    spacer: SpacerSchema,
    pattern: PatternSchema,
  })
  .superRefine((data, ctx) => {
    // 1. Triple Glazing Thickness Check
    if (
      (data.glazing === "tg_standard" || data.glazing === "tg_toughened") &&
      data.thickness < 32
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Triple glazing requires at least 32mm thickness",
        path: ["thickness"],
      });
    }

    // 2. Laminated / Acoustic Glazing Thickness Restriction (Must be 28mm)
    if (
      (data.glazing === "dg_laminated" || data.glazing === "dg_acoustic") &&
      data.thickness !== 28.8
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Laminated and acoustic double glazing must be 28.8mm thick",
        path: ["thickness"],
      });
    }
  });

export type SealedUnit = z.infer<typeof UnitSchema>;
export type GlazingType = z.infer<typeof GlazingSchema>;
export type SpacerType = z.infer<typeof SpacerSchema>;
