import styles from "./packingHelper.module.css";
export const PackingHelper = () => {
  return (
    <div class={styles.helperWrapper}>
      <button
        popovertarget={styles.packingInfo}
        class={styles.helperTrigger}
        type="button"
      >
        ?
      </button>

      <div id={styles.packingInfo} popover class={styles.popoverContent}>
        <p>
          <strong>Deduction Rule:</strong>
        </p>
        <p>
          Standard practice is to deduct 10mm from your tight opening size to
          allow for packers and expansion.
        </p>
        <p class={styles.example}>Example: 1200mm → 1190mm</p>
      </div>
    </div>
  );
};
