import styles from "./ClearSurveryModal.module.css";
import type { SealedUnit } from "~/lib/Types";

type Props = {
  onConfirm: (units: SealedUnit[]) => void;
  count: number;
};

export function ClearSurveyModal(props: Props) {
  let dialogRef: HTMLDialogElement | undefined;

  // We use a separate signal to trigger the native showModal() method
  const openModal = () => dialogRef?.showModal();
  const closeModal = () => dialogRef?.close();

  const clearAllSurveys = () => {
    // 1. Clear the signal
    props.onConfirm([] as SealedUnit[]);

    // 2. Clear the persistence
    localStorage.removeItem("pending_surveys");

    // 3. Close the native dialog
    dialogRef?.close();
  };

  return (
    <>
      {/* The Trigger Button - usually placed near the table */}
      <button class={styles.btnClearAll} onClick={openModal}>
        Clear Survey
      </button>

      {/* The Native Dialog */}
      <dialog
        ref={dialogRef}
        class={styles.modal}
        onClose={closeModal} // Handles the 'Esc' key automatically
      >
        <div class={styles.modalBody}>
          <h3>Delete All Units?</h3>
          <p>
            You have {props.count} units in this survey. This cannot be undone.
          </p>

          <div class={styles.actions}>
            <button onClick={closeModal} class={styles.btnCancel}>
              Keep Data
            </button>
            <button
              onClick={() => {
                clearAllSurveys();
              }}
              class={styles.btnConfirm}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
