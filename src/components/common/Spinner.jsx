export default function Spinner({ type = "primarySpinner", className = ""}) {
  const base = 
  "mx-auto animate-spin rounded-full border-4 border-amber-50 border-t-transparent my-12 "

  const styles = {
    primarySpinner: `${base} h-15 w-15`,
    buttonSpinner: `${base} h-4 w-4 `
  }
  return (
    <div
      className={styles[type] + className }
      aria-label="Loading"
      role="status"
    />
  );
}
