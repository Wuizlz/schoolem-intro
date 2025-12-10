// src/hooks/useOutsideClick.js
import { useEffect, useRef } from "react";

/**
 * Returns a ref. When a pointerdown happens outside that ref, calls handler().
 * Optionally skip events that originate from elements matching ignoreSelector.
 */
export default function useOutsideClick(handler, ignoreSelector) {
  const ref = useRef(null);

  useEffect(() => {
    function onPointerDown(e) {
      if (!ref.current) return;
      if (ignoreSelector && e.target.closest(ignoreSelector)) return;
      if (!ref.current.contains(e.target)) handler?.(e);
    }
    // capture so it runs before other handlers that might stopPropagation
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [handler, ignoreSelector]);

  return ref;
}
