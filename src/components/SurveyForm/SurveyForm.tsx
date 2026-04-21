import type { SealedUnit, GlazingType, SpacerType } from "~/lib/Types";
import styles from "./SurveyFom.module.css";
import { For } from "solid-js";
import { GLAZING_SCHEMA, SPACER_SCHEMA } from "~/lib/const";
import { RotateCcw } from "lucide-solid";

interface Props {
  current: SealedUnit[];
  set: (units: SealedUnit[]) => void;
}

export default function SurveyForm(props: Props) {
  const addUnit = (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newEntry = {
      id: Date.now(),
      ref: formData.get("ref") as string,
      width: Number(formData.get("width")),
      height: Number(formData.get("height")),
      thickness: Number(formData.get("thickness")),
      glazing: formData.get("glazing") as GlazingType,
      spacer: formData.get("spacer") as SpacerType,
    };
    props.set([...props.current, newEntry]);
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={addUnit} class={styles.form}>
      <input
        class={styles.formGroup}
        name="ref"
        placeholder="Reference"
        required
      />
      <input
        class={styles.formGroup}
        name="width"
        type="number"
        placeholder="Width (mm)"
        required
      />
      <input
        class={styles.formGroup}
        name="height"
        type="number"
        placeholder="Height (mm)"
        required
      />
      <div class={styles.formGroup}>
        <label for="thickness">Thickness</label>
        <select id="thickness" name="thickness" required>
          <option value="">--Select Thickness--</option>
          <option value={14}>14mm (4/6/4)</option>
          <option value={16}>16mm (4/8/4)</option>
          <option value={18}>18mm (4/10/4)</option>
          <option value={20}>20mm (4/12/4)</option>
          <option value={24}>24mm (4/16/4)</option>
          <option value={28}>28mm (4/20/4) Most Common</option>
        </select>
      </div>
      <div class={styles.formGroup}>
        <label for="glazing-type">Glazing</label>
        <select id="glazing-type" name="glazing" required>
          <option value="" disabled selected>
            --Select Glazing--
          </option>
          <For each={Object.entries(GLAZING_SCHEMA)}>
            {([value, label]) => <option value={value}>{label}</option>}
          </For>
        </select>
      </div>
      <div class={styles.formGroup}>
        <label for="spacer-bar">Spacer-Bar</label>
        <select id="spacer-bar" name="spacer" required>
          <option value="" disabled selected>
            --Select Spacer--
          </option>
          <For each={Object.entries(SPACER_SCHEMA)}>
            {([value, label]) => <option value={value}>{label}</option>}
          </For>
        </select>
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
