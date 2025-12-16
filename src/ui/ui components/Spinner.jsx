export default function Spinner({ type = "primarySpinner", className = "" }) {
  const base =
    "mx-auto animate-spin rounded-full border-4 " +
    "border-[var(--color-grey-200)] border-t-[var(--color-accent)]";

  const styles = {
    primarySpinner: `${base} my-12 h-12 w-12`, // bigger loader
    buttonSpinner: `${base} my-0 h-4 w-4`,     // small loader for buttons
  };

  return (
    <div
      className={`${styles[type] ?? styles.primarySpinner} ${className}`.trim()}
      aria-label="Loading"
      role="status"
    />
  );
}