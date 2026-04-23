import type { SealedUnit } from "~/lib/Types";
import styles from "./ComfirmRemove.module.css";
import { X } from "lucide-solid";

interface Props {
  units: SealedUnit[];
  set: (units: SealedUnit[]) => void;
  current: number;
}

export function ConfirmRemove(props: Props) {
  let dialogRef: HTMLDialogElement | undefined;

  // We use a separate signal to trigger the native showModal() method
  const openModal = () => dialogRef?.showModal();
  const closeModal = () => dialogRef?.close();

  const removeUnit = (id: number) => {
    const updated = props.units.filter((u) => u.id !== id);
    props.set(updated);
    localStorage.setItem("pending_surveys", JSON.stringify(updated));

    dialogRef?.close();
  };

  return (
    <>
      {/* The Trigger Button - usually placed near the table */}
      <button class={styles.deleteBtn} onClick={openModal}>
        <X />
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
            Are you sure you want to remove this unit. This cannot be undone.
          </p>

          <div class={styles.actions}>
            <button onClick={closeModal} class={styles.btnCancel}>
              Keep Data
            </button>
            <button
              onClick={() => {
                removeUnit(props.current);
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
