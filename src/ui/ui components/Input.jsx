// ui/Input.jsx
import React, { forwardRef, useId } from "react";

const Input = forwardRef(
  (
    { id, type = "text", placeholder, className = "", error, ...props },
    ref
  ) => {
    const generatedId = useId(); // ✅ always called
    const inputId = id ?? generatedId; // choose after

    const border = error
      ? "border-red-500 focus:ring-red-500"
      : " border-zinc-600/70  focus:ring-white/30";

    return (
      <div className="space-y-2">
        <input
          id={inputId}
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-full border px-4 py-4 text-lg  placeholder:text-zinc-400 focus:outline-none focus:ring-2 ${border} ${className}`}
          {...props}
        />

        {error && <p className="text-sm text-red-400">{error.message}</p>}
      </div>
    );
  }
);

export default Input;
