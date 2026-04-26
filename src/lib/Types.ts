import { z } from "zod";

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
  { value: 32, label: "32mm (4/10/4/10/4) High Performance" },
  { value: 36, label: "36mm (4/12/4/12/4)" },
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
  })

  .refine(
    (data) => {
      if (
        data.glazing === "tg_standard" ||
        (data.glazing === "tg_toughened" && data.thickness < 28)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Triple glazing requires at least 28mm thickness",
      path: ["thickness"], // This ensures the error appears under the 'thickness' field
    },
  );

export type SealedUnit = z.infer<typeof UnitSchema>;
export type GlazingType = z.infer<typeof GlazingSchema>;
export type SpacerType = z.infer<typeof SpacerSchema>;
