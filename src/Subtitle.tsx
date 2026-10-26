import React from "react";
import { useCurrentFrame } from "remotion";
import { SUBS } from "./subtitles";
import { CHAPTERS } from "./timing";

// Kalimat panjang dipecah jadi potongan ≤ 60 karakter, lebih suka memenggal setelah koma.
const split = (t: string, max = 60): string[] => {
  const out: string[] = [];
  let cur = "";
  for (const w of t.split(" ")) {
    if (cur && cur.length + w.length + 1 > max) {
      out.push(cur);
      cur = w;
    } else cur = cur ? cur + " " + w : w;
    if (cur.length > 32 && /[,:]$/.test(cur)) {
      out.push(cur);
      cur = "";
    }
  }
  if (cur) out.push(cur);
  return out;
};

export const Subtitle: React.FC<{ chapter: number }> = ({ chapter }) => {
  const frame = useCurrentFrame();
  const subs = SUBS[chapter];
  if (!subs || frame < subs[0][0]) return null;
  let i = 0;
  subs.forEach(([f], k) => {
    if (frame >= f) i = k;
  });
  const start = subs[i][0];
  const end = i + 1 < subs.length ? subs[i + 1][0] : CHAPTERS[chapter].frames;
  if (frame > end) return null;

  // Potongan dalam satu kalimat dibagi sesuai panjang karakternya.
  const parts = split(subs[i][1]);
  const total = parts.reduce((a, p) => a + p.length, 0);
  const pos = ((frame - start) / Math.max(1, end - start)) * total;
  let acc = 0;
  let k = 0;
  while (k < parts.length - 1 && acc + parts[k].length <= pos) {
    acc += parts[k].length;
    k++;
  }

  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, display: "flex", justifyContent: "center" }}>
      <span
        style={{
          background: "rgba(0,0,0,0.62)",
          color: "#fff",
          fontFamily: "Georgia, serif",
          fontSize: 40,
          padding: "8px 26px",
          borderRadius: 14,
        }}
      >
        {parts[k]}
      </span>
    </div>
  );
};