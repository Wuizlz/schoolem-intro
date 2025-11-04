// src/ui/ScrollDown.jsx
// A fully-styled pill select using Headless UI's Listbox
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

export default function ScrollDown({
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  disabled = false,
}) {
  const selected = options.find((o) => o.value === value) || null;

  return (
    <div className="w-full">
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <ListboxButton
            id={id}
            className={`w-full rounded-full border px-4 py-4 text-left text-lg
                        border-zinc-600/70 bg-zinc-900 text-zinc-100
                        focus:outline-none focus:ring-2 focus:ring-white/30
                        ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          >
            <span className={!selected ? "text-zinc-400" : ""}>
              {selected?.label ?? placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              {/* chevron */}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
              </svg>
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute z-50 mt-2 w-full overflow-hidden
                         rounded-3xl border border-zinc-700 bg-zinc-900
                         shadow-xl focus:outline-none"
            >
              {options.map((opt) => (
                <ListboxOption
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-3 text-lg
                     ${active ? "bg-zinc-800" : ""}`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span className={selected ? "font-medium" : "font-normal"}>
                        {opt.label}
                      </span>
                      {selected && (
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M16.7 5.3a1 1 0 010 1.4l-7.2 7.2a1 1 0 01-1.4 0L3.3 9.1a1 1 0 111.4-1.4l3 3 6.5-6.5a1 1 0 011.5.1z" />
                        </svg>
                      )}
                    </div>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
