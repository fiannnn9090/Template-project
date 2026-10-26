import React from "react";
import { AbsoluteFill } from "remotion";
import { BLUE, CREAM, Dots, FONT_STENCIL, GOLD, RED } from "./common";
import { MapBase } from "./Bab2";
import { AlexanderBust } from "./Alexander";

const OUT = {
  stroke: "#1c130a",
  strokeWidth: 18,
  strokeLinejoin: "round",
  paintOrder: "stroke",
} as const;

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#07090f" }}>
    <svg viewBox="0 0 1280 720" width="100%" height="100%">
      <defs>
        <linearGradient id="th-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#07090f" stopOpacity="0.85" />
          <stop offset="0.7" stopColor="#07090f" stopOpacity="0.35" />
          <stop offset="1" stopColor="#07090f" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <g transform="translate(640 360) scale(2.6) translate(-1349 -456)">
        <MapBase empire={0} />
      </g>
      <rect width={1280} height={720} fill="url(#th-shade)" />

      <AlexanderBust x={1000} y={330} s={2} frame={60} />

      <text x={60} y={250} fontSize={160} letterSpacing={4} fill={CREAM} fontFamily={FONT_STENCIL} {...OUT}>
        GAUGAMELA
      </text>
      <text x={64} y={350} fontSize={92} letterSpacing={4} fill={GOLD} fontFamily={FONT_STENCIL} {...OUT} strokeWidth={14}>
        TAKTIK GENIUS
      </text>

      <Dots cx={250} cy={540} rows={4} cols={16} gap={22} fill={RED} />
      <text x={510} y={585} textAnchor="middle" fontSize={64} fill={GOLD} fontFamily={FONT_STENCIL} {...OUT} strokeWidth={12}>
        VS
      </text>
      <Dots cx={640} cy={560} rows={2} cols={5} gap={22} fill={BLUE} />
    </svg>
  </AbsoluteFill>
);