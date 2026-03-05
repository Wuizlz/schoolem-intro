import React, { useState } from "react";

export const ThreadContent = React.memo(function ThreadContent({
  publicationData,
}) {
  const [expanded, setExpanded] = useState(false);
  const text = publicationData?.thread_text ?? "";
  const MAX = 180; // pick your min chars/preview
  const showToggle = text.length > MAX;
  const displayText = expanded || !showToggle ? text : text.slice(0, MAX);
  const username = publicationData?.display_name;
  return (
    <div className="text-amber-50 font-extralight leading-relaxed">
      <span className="font-extrabold">{publicationData?.full_name}</span>
      <span
        style={{
          overflowWrap: "anywhere",
        }}
        className="w-full whitespace-pre-wrap break-words overflow-hidden"
      >
        : {displayText}
      </span>

      {showToggle && (
        <button
          type="button"
          className="self-start text-sm text-gray-500 hover:text-gray-200 hover:cursor-pointer"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "...less" : "...more"}
        </button>
      )}
    </div>
  );
});
