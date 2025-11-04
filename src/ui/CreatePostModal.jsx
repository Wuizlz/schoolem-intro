// src/ui/CreatePostModal.jsx
import { useRef, useState } from "react";

/**
 * Simple create-post dialog UI.
 * - Drag images/videos onto the dropzone OR click the big button to pick files.
 * - Calls onCloseModal() when "Post a thread" clicked (you can wire real submit later).
 */
export default function CreatePostModal({ onCloseModal }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  function handlePickClick() {
    inputRef.current?.click();
  }

  function handleInputChange(e) {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  }

  function handleDrop(e) {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []);
    // accept images/videos only
    const filtered = list.filter((f) => /^image|video\//.test(f.type));
    setFiles((prev) => [...prev, ...filtered]);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">
        Create new post or thread!
      </h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full rounded-2xl border-2 border-dashed border-zinc-700
                   bg-zinc-800/40 p-8 text-center"
      >
        <p className="mb-3 text-lg text-zinc-200">Cherish and remember your moments! ✨</p>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-700/60">
          {/* simple media icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-zinc-200">
            <rect x="3" y="3" width="18" height="14" rx="2" stroke="currentColor" />
            <path d="M8 10.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" />
            <path d="M21 17l-5-5-4 4-3-3-6 6" stroke="currentColor" />
          </svg>
        </div>

        <p className="mb-4 text-xl font-semibold">Drag photos and videos here</p>

        <button
          type="button"
          onClick={handlePickClick}
          className="mx-auto block rounded-2xl px-6 py-4 text-lg font-extrabold
                     bg-yellow-300 text-black hover:bg-yellow-200"
        >
          Upload from computer
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Selected files preview list (names only for now) */}
        {files.length > 0 && (
          <div className="mt-6 text-left text-sm text-zinc-300">
            <p className="mb-2 font-medium">Selected:</p>
            <ul className="max-h-28 space-y-1 overflow-auto pr-1">
              {files.map((f, i) => (
                <li key={i} className="truncate">
                  • {f.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="relative w-full">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <span className="block h-px w-full bg-zinc-700" />
        </div>
        <span className="relative mx-auto block w-fit bg-zinc-900 px-3 text-sm text-zinc-300">
          or
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          // TODO: open thread composer instead
          onCloseModal?.();
        }}
        className="text-base font-medium text-zinc-200 underline underline-offset-4 hover:text-zinc-100"
      >
        Post a thread
      </button>
    </div>
  );
}
