import { useMemo } from "react";

export default function useEmojiFavicon(emoji: string) {
  return useMemo(() => toDataURL(emoji), [emoji]);
}

function toDataURL(emoji: string) {
  if (typeof document === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 32;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "32px sans-serif";
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillText(emoji, canvas.width / 2, canvas.height / 2 + 2);
  return canvas.toDataURL("image/png");
}
