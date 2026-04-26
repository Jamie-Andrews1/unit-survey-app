import styles from "./SurveyFom.module.css";
import { For, Show } from "solid-js";
import { GLAZING_SCHEMA, SPACER_SCHEMA } from "~/lib/const";
import { RotateCcw } from "lucide-solid";
import { UnitSchema, THICKNESS_OPTIONS } from "~/lib/Types";
import { z } from "zod";
import { createStore } from "solid-js/store";
import type { SealedUnit } from "~/lib/Types";

interface Props {
  current: SealedUnit[];
  set: (units: SealedUnit[]) => void;
}

export default function SurveyForm(props: Props) {
  const [errors, setErrors] = createStore<Record<string, string[] | undefined>>(
    {},
  );

  const addUnit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    // We use Object.fromEntries to grab everything at once
    const rawData = Object.fromEntries(formData.entries());

    // Use a modified schema that coerces strings to numbers
    const result = UnitSchema.safeParse({ ...rawData, id: Date.now() });

    setErrors({});
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors(fieldErrors);
      console.log(errors);
      return;
    }

    const newEntry = result.data;

    props.set([...props.current, newEntry]);
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
          onchange={() => setErrors("thickness", undefined)}
          class={errors.thickness ? styles.animateShake : ""}
        >
          <option value="">--Select Thickness--</option>
          <For each={THICKNESS_OPTIONS}>
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
          onchange={() => setErrors("glazing", undefined)}
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
          onchange={() => setErrors("spacer", undefined)}
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
      <span class={styles.formActions}>
        <button type="submit">Add Unit</button>
        <button type="reset" value="Reset">
          <RotateCcw />
        </button>
      </span>
    </form>
  );
}
