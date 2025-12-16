// ui/Input.jsx
import { forwardRef, useId } from "react";

const Input = forwardRef(
  (
    {
      id,
      type = "text",
      styleType = "signForm",
      placeholder,
      className = "",
      error,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const styles = {
      signForm: {
        base:
          "w-full rounded-full border px-4 py-4 text-lg " +
          "bg-[var(--color-grey-0)] text-[var(--color-grey-900)] " +
          "placeholder:text-[var(--color-grey-500)] " +
          "focus:outline-none focus:ring-2",
        ok: "border-[var(--color-grey-200)] focus:ring-[var(--color-accent)]",
        err: "border-red-500 focus:ring-red-500",
      },

      comment: {
        base:
          "w-full bg-transparent py-2 " +
          "text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-500)] " +
          "border-b focus:outline-none focus:ring-0",
        ok:
          "border-[var(--color-grey-200)] focus:border-[var(--color-accent)]",
        err: "border-red-500 focus:border-red-500",
      },
    };

    const variant = styles[styleType] ?? styles.signForm;
    const state = error ? variant.err : variant.ok;

    return (
      <div className="space-y-2">
        <input
          id={inputId}
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`${variant.base} ${state} ${className}`.trim()}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    );
  }
);

export default Input;