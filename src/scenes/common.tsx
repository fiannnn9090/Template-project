import React from "react";
import { Easing, interpolate } from "remotion";

export const FONT_SERIF = "Georgia, 'Times New Roman', serif";
export const FONT_STENCIL = "Impact, 'Arial Black', sans-serif";
export const INK = "#2a1a0a";
export const CREAM = "#f6ecd2";
export const GOLD = "#e0b54a";
export const RED = "#c93a3f";
export const BLUE = "#2f6fe0";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// 0 -> 1 antara dua frame, dengan easing halus.
export const prog = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

// Muncul membal: skala 0 -> 1 (sedikit melewati 1) mulai dari frame tertentu.
export const pop = (frame: number, from: number, dur = 20) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.6)),
  });

// Fade in di awal dan fade out di akhir scene.
export const fadeIO = (frame: number, total: number, inF = 24, outF = 24) =>
  interpolate(frame, [0, inF, total - outF, total], [0, 1, 1, 0], clamp);

// Definisi prajurit kecil (dipakai lewat <use href="#sold-per" />).
export const SoldierDefs: React.FC = () => (
  <defs>
    <g id="sold-per">
      <line x1="9" y1="-6" x2="9" y2="-44" stroke="#4a3426" strokeWidth="2.5" />
      <rect x="-7" y="0" width="14" height="22" rx="5" fill="#a8322d" />
      <circle cx="0" cy="-8" r="8" fill="#f3d3b0" />
      <path d="M-9,-9 Q-9,-20 0,-20 Q9,-20 9,-9 Z" fill="#5a2b25" />
    </g>
    <g id="sold-mak">
      <line x1="9" y1="-6" x2="9" y2="-44" stroke="#4a3426" strokeWidth="2.5" />
      <rect x="-7" y="0" width="14" height="22" rx="5" fill="#2c63c9" />
      <circle cx="0" cy="-8" r="8" fill="#f3d3b0" />
      <path d="M-9,-9 Q-9,-20 0,-20 Q9,-20 9,-9 Z" fill="#d9a441" />
    </g>
  </defs>
);

// Karakter chibi: kepala besar, mata titik, bernapas dan berkedip pelan.
export const Chibi: React.FC<{
  x: number;
  y: number;
  s?: number;
  frame: number;
  skin?: string;
  cloak?: string;
  flip?: boolean;
}> = ({ x, y, s = 1, frame, skin = "#f3d3b0", cloak = "#a8322d", flip = false }) => {
  const bob = Math.sin(frame / 14) * 3;
  const blink = frame % 120 < 5 ? 0.1 : 1;
  const dir = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s * dir} ${s})`}>
      <path d="M-46,120 Q-56,40 -22,22 L22,22 Q56,40 46,120 Z" fill={cloak} />
      <circle cx={0} cy={-20} r={56} fill={skin} />
      <path
        d="M-58,-26 Q-58,-92 0,-92 Q58,-92 58,-26 Q30,-44 0,-44 Q-30,-44 -58,-26 Z"
        fill="#d9a441"
      />
      <path d="M4,-92 Q-4,-140 34,-128 Q18,-112 16,-90 Z" fill="#b8282b" />
      <ellipse cx={14} cy={-16} rx={5.5} ry={6 * blink} fill="#1c130a" />
      <ellipse cx={42} cy={-16} rx={5.5} ry={6 * blink} fill="#1c130a" />
    </g>
  );
};

// Sorotan cahaya diagonal yang berdenyut pelan.
export const LightBeams: React.FC<{ frame: number; opacity?: number }> = ({
  frame,
  opacity = 0.1,
}) => {
  const pulse = 0.75 + 0.25 * Math.sin(frame / 40);
  return (
    <g opacity={opacity * pulse} fill="#ffffff">
      <polygon points="200,0 420,0 -60,1080 -280,1080" />
      <polygon points="620,0 760,0 380,1080 240,1080" />
      <polygon points="1100,0 1380,0 1000,1080 720,1080" />
    </g>
  );
};

// Label berbentuk plakat krem.
export const Tag: React.FC<{
  x: number;
  y: number;
  text: string;
  s: number;
  o?: number;
}> = ({ x, y, text, s, o = 1 }) => {
  const w = text.length * 17 + 44;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect
        x={-w / 2}
        y={-30}
        width={w}
        height={60}
        rx={12}
        fill={CREAM}
        stroke={INK}
        strokeWidth={5}
      />
      <text
        y={2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={30}
        letterSpacing={2}
        fill={INK}
        fontFamily={FONT_STENCIL}
      >
        {text}
      </text>
    </g>
  );
};

// Gugus titik pasukan.
export const Dots: React.FC<{
  cx: number;
  cy: number;
  rows: number;
  cols: number;
  gap: number;
  fill: string;
  r?: number;
}> = ({ cx, cy, rows, cols, gap, fill, r = 7 }) => (
  <g>
    {Array.from({ length: rows * cols }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      return (
        <circle
          key={i}
          cx={cx + (col - (cols - 1) / 2) * gap}
          cy={cy + (row - (rows - 1) / 2) * gap}
          r={r}
          fill={fill}
          stroke="#1b0f08"
          strokeOpacity={0.5}
          strokeWidth={1}
        />
      );
    })}
  </g>
);