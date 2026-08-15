import styles from "./SurveyFom.module.css";
import { For, Show, createSignal, createMemo } from "solid-js";
import { GLAZING_SCHEMA, SPACER_SCHEMA } from "~/lib/const";
import { RotateCcw } from "lucide-solid";
import { getAvailableThicknesses } from "~/lib/GetAvailableThick";
import type { GlazingType } from "~/lib/Types";
import { UnitSchema, THICKNESS_OPTIONS, GlassPattern } from "~/lib/Types";
import { z } from "zod";
import { createStore } from "solid-js/store";
import type { SealedUnit } from "~/lib/Types";
import patternData from "../../data/patterns.json";

interface Props {
  current: SealedUnit[];
  set: (units: SealedUnit[]) => void;
}

type ThicknessType = (typeof THICKNESS_OPTIONS)[number]["value"];

export default function SurveyForm(props: Props) {
  const [hasPattern, setHasPattern] = createSignal(false);
  const [glazing, setGlazing] = createSignal<GlazingType>("dg_standard");
  const [thickness, setThickness] = createSignal<ThicknessType>(28);
  const [errors, setErrors] = createStore<Record<string, string[] | undefined>>(
    {},
  );

  const availableThicknesses = createMemo(() =>
    getAvailableThicknesses(glazing()),
  );

  const handleGlazingChange = (newGlazing: GlazingType) => {
    setGlazing(newGlazing);

    const validValues = getAvailableThicknesses(newGlazing).map(
      (opt) => opt.value,
    );
    if (!validValues.includes(thickness())) {
      setThickness(validValues[0]);
    }
  };

  const patterns = patternData as GlassPattern[];

  const addUnit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const rawData = Object.fromEntries(formData.entries());

    const result = UnitSchema.safeParse({
      ...rawData,
      id: Date.now(),
      pattern: {
        hasPattern: hasPattern(), // true or false from your Solid signal
        patternId: hasPattern() ? rawData.pattern : undefined,
      },
    });

    setErrors({});
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors(fieldErrors);
      console.log(errors);
      return;
    }

    const newEntry = result.data;

    props.set([...props.current, newEntry]);
    setHasPattern(false);
    form.reset();
  };

  return (
    <form onSubmit={addUnit} class={styles.form}>
      <div class={styles.formGroup}>
        <input
          name="ref"
          placeholder="Reference"
          required
          aria-invalid={errors.ref ? "true" : "false"}
          aria-describedby="ref-error"
          class={errors.ref ? styles.animateShake : ""}
          onInput={() => setErrors("ref", undefined)}
        />
        <Show when={errors.ref}>
          <span id="ref-error" class={styles.formError}>
            {errors.ref}
          </span>
        </Show>
      </div>

      <div class={styles.formGroup}>
        <input
          name="width"
          type="number"
          placeholder="Width (mm)"
          required
          aria-invalid={errors.width ? "true" : "false"}
          aria-describedby="width-error"
          class={errors.width ? styles.animateShake : ""}
          onInput={() => setErrors("width", undefined)}
        />
        <Show when={errors?.width}>
          <span id="width-error" class={styles.formError}>
            {errors.width}
          </span>
        </Show>
      </div>

      <div class={styles.formGroup}>
        <input
          name="height"
          type="number"
          placeholder="Height (mm)"
          required
          aria-invalid={errors.height ? "true" : "false"}
          aria-describedby="height-error"
          class={errors.height ? styles.animateShake : ""}
          onInput={() => setErrors("height", undefined)}
        />
        <Show when={errors.height}>
          <span id="height-error" class={styles.formError}>
            {errors.height}
          </span>
        </Show>
      </div>
      <div class={styles.formGroup}>
        <label for="thickness">Thickness</label>
        <select
          id="thickness"
          name="thickness"
          required
          aria-invalid={!!errors.thickness}
          value={thickness()}
          onChange={(e) => {
            const selectedVal = Number(e.currentTarget.value) as ThicknessType;
            setThickness(selectedVal);
          }}
          class={errors.thickness ? styles.animateShake : ""}
        >
          <option value="">--Select Thickness--</option>
          <For each={availableThicknesses()}>
            {(option) => <option value={option.value}>{option.label}</option>}
          </For>
        </select>
        <Show when={errors.thickness}>
          <span id="thickness-error" class={styles.formError}>
            {errors.thickness?.[0]}
          </span>
        </Show>
      </div>
      <div class={styles.formGroup}>
        <label for="glazing-type">Glazing</label>
        <select
          id="glazing-type"
          name="glazing"
          required
          value={glazing() as string}
          onChange={(e) =>
            handleGlazingChange(e.currentTarget.value as GlazingType)
          }
          class={errors.glazing ? styles.animateShake : ""}
        >
          <option value="" disabled selected>
            --Select Glazing--
          </option>
          <For each={Object.entries(GLAZING_SCHEMA)}>
            {([value, label]) => <option value={value}>{label}</option>}
          </For>
        </select>
        <Show when={errors.glazing}>
          <span id="glazing-error" class={styles.formError}>
            {errors.glazing}
          </span>
        </Show>
      </div>
      <div class={styles.formGroup}>
        <label for="spacer-bar">Spacer-Bar</label>
        <select
          id="spacer-bar"
          name="spacer"
          onChange={() => setErrors("spacer", undefined)}
          class={errors.spacer ? styles.animateShake : ""}
        >
          <option value="" disabled selected>
            --Select Spacer--
          </option>
          <For each={Object.entries(SPACER_SCHEMA)}>
            {([value, label]) => <option value={value}>{label}</option>}
          </For>
        </select>
        <Show when={errors.spacer}>
          <span id="spacer-error" class={styles.formError}>
            {errors.spacer}
          </span>
        </Show>
      </div>
      <div class={styles.formGroup}>
        <label>
          <input
            style={{ width: "2rem" }}
            type="checkbox"
            name="hasPattern"
            checked={hasPattern()}
            onchange={(e) => {
              const checked = e.currentTarget.checked;
              setHasPattern(checked);
              if (!checked) setErrors("pattern.patternId", undefined);
            }}
          />
          Is this Patterned Or Specially Coated?
        </label>
      </div>
      <Show when={hasPattern()}>
        <div class={styles.formGroup}>
          <label for="patterns">Pattern</label>
          <select
            id="patterns"
            name="pattern"
            onchange={() => setErrors("pattern.patternId", undefined)}
            class={errors.pattern ? styles.animateShake : ""}
          >
            <option value="" disabled selected>
              --Select Pattern--
            </option>
            <For each={patterns}>
              {(pattern) => (
                <option value={pattern.id}>
                  {pattern.name} (privacy level {pattern.level})
                </option>
              )}
            </For>
          </select>
          <Show when={errors.pattern}>
            <span id="pattern-error" class={styles.formError}>
              {errors.pattern}
            </span>
          </Show>
        </div>
      </Show>

      <span class={styles.formActions}>
        <button type="submit">Add Unit</button>
        <button type="reset" value="Reset" title="reset">
          <RotateCcw />
        </button>
      </span>
    </form>
  );
}
