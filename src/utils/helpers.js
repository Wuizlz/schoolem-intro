import imageCompression from "browser-image-compression";

export const formatRelative = (dateString) => {
  if (!dateString) return "";
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = Math.max(0, now - then);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 5) return "now";
  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};


export async function downscaleFile(file) {
  const opts = {
    maxWidthOrHeight: 1400, // pick your target
    maxSizeMB: 0.8,        // try to stay under ~800 KB
    initialQuality: 0.75,
    fileType: "image/webp", // or "image/jpeg"
    useWebWorker: true,
  };
  return imageCompression(file, opts);
}

