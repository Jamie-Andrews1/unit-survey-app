import { Title } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import { For, onMount, createSignal, Show } from "solid-js";
import { generateShareText } from "~/lib/const";
import type { SealedUnit } from "~/lib/Types";
import styles from "./index.module.css";
import { ClearSurveyModal } from "~/components/ClearSurveryModal/ClearSurveyModal";
import { generateSurveyPDF } from "~/lib/pdfGenerator";
import { ConfirmRemove } from "~/components/ConfirmRemove/ConfirmRemove";
import { PackingHelper } from "~/lib/packingHelper/packingHelper";

const SurveyForm = clientOnly(
  () => import("../components/SurveyForm/SurveyForm"),
);

export default function SurveyPage() {
  const [surveys, setSurveys] = createSignal<SealedUnit[]>([]);

  const [hasLoaded, setHasLoaded] = createSignal(false);

  onMount(() => {
    const saved = localStorage.getItem("pending_surveys");
    if (saved) {
      try {
        setSurveys(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse surveys", e);
      }
    }
    setHasLoaded(true);
  });

  const updateSurveys = (newList: SealedUnit[]) => {
    setSurveys(newList);
    localStorage.setItem("pending_surveys", JSON.stringify(newList));
  };

  const shareSurvey = async () => {
    const shareData = {
      title: "Sealed Unit Survey",
      text: surveys()
        .map((s) => `${s.ref}: ${s.width}x${s.height}`)
        .join(", "),
      url: window.location.href, // Or a link to the PDF if uploaded
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to the WhatsApp link logic above
        window.location.href = `https://wa.me/?text=${generateShareText(surveys)}`;
      }
    } catch (err) {
      console.log("Share failed", err);
    }
  };
  return (
    <main>
      <Title>Sealed Unit Survey</Title>
      <h1>
        Sealed Unit Survey
        <div style={{ "margin-inline": "70%" }}>
          <PackingHelper />
        </div>
      </h1>

      <Show when={hasLoaded()} fallback={<p>Loading survey data...</p>}>
        <SurveyForm set={updateSurveys} current={surveys()} />

        <h2>Surveyed Units ({surveys().length})</h2>
        <Show when={surveys().length > 0}>
          <ClearSurveyModal count={surveys().length} onConfirm={setSurveys} />
        </Show>
        <div class={styles.surveyContainer}>
          <div class={styles.unitCards}>
            <For each={surveys()}>
              {(unit) => (
                <div class={styles.unitCard}>
                  <div class={styles.cardHeader}>
                    <strong>{unit.ref}</strong>
                    <ConfirmRemove
                      current={unit.id}
                      set={updateSurveys}
                      units={surveys()}
                    />
                  </div>
                  <div class={styles.cardBody}>
                    <span>
                      {unit.width}mm x {unit.height}mm
                    </span>
                    <span class="thickness-tag">{unit.thickness}mm</span>
                  </div>
                </div>
              )}
            </For>
          </div>

          <table class="unit-table hidden md:table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Dimensions</th>
                <th>Thickness</th>
                <th>Spacer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <For each={surveys()}>
                {(unit) => (
                  <tr>
                    <td>{unit.ref}</td>
                    <td>
                      {unit.width}w × {unit.height}
                    </td>
                    <td>{unit.thickness}mm</td>
                    <td>{unit.spacer}</td>
                    <td>
                      <ConfirmRemove
                        current={unit.id}
                        set={updateSurveys}
                        units={surveys()}
                      />
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
      <Show when={surveys().length > 0}>
        <div class={styles.shareActions}>
          {/* WhatsApp */}
          <button
            style={{ "background-color": "rgb(37, 211, 102)", color: "white" }}
            onClick={() => shareSurvey()}
            class="btn-whatsapp"
          >
            Share to WhatsApp
          </button>

          <button
            onClick={() => generateSurveyPDF(surveys())}
            class={styles.btnExport}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              style="width: 18px; height: 18px; margin-right: 8px;"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF Report
          </button>

          {/* SMS */}
          <a href={`sms:?body=${generateShareText(surveys)}`} class="btn-sms">
            Share via SMS
          </a>
        </div>
      </Show>
    </main>
  );
}
