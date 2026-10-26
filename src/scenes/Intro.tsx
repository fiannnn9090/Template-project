import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CREAM, FONT_STENCIL, GOLD, clamp, fadeIO, prog } from "./common";
import { MapBase } from "./Bab2";

// Pusat peta dan titik Gaugamela (43,3 BT; 36,4 LU) dalam koordinat peta Bab 2.
const CENTER: [number, number] = [960, 540];
const TARGET: [number, number] = [1349.33, 456];
const OUT = {
  stroke: "#1c130a",
  strokeWidth: 16,
  strokeLinejoin: "round",
  paintOrder: "stroke",
} as const;

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dive = interpolate(frame, [0, 150], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cx = CENTER[0] + (TARGET[0] - CENTER[0]) * dive;
  const cy = CENTER[1] + (TARGET[1] - CENTER[1]) * dive;
  const z = 1 + 2.2 * dive;
  const dark = 0.75 - 0.5 * prog(frame, 0, 150) + 0.2 * prog(frame, 140, 170);
  const stamp = interpolate(frame, [150, 164], [2.2, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const stampO = interpolate(frame, [150, 156], [0, 1], clamp);
  const t = frame >= 160 ? ((frame - 160) % 60) / 60 : -1;

  return (
    <AbsoluteFill style={{ opacity: fadeIO(frame, 240, 18, 12), background: "#07090f" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <radialGradient id="in-vig" cx="50%" cy="50%" r="75%">
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
        </defs>

        <g transform={`translate(960 540) scale(${z}) translate(${-cx} ${-cy})`}>
          <MapBase empire={0} />
        </g>
        <rect width={1920} height={1080} fill="#07090f" opacity={dark} />
        <rect width={1920} height={1080} fill="url(#in-vig)" />

        {t >= 0 ? (
          <circle cx={960} cy={540} r={120 + 200 * t} fill="none" stroke="#c93a3f" strokeWidth={6} opacity={0.8 * (1 - t)} />
        ) : null}

        <g transform={`translate(960 565) scale(${stamp})`} opacity={stampO}>
          <text textAnchor="middle" fontSize={230} letterSpacing={8} fill={CREAM} fontFamily={FONT_STENCIL} {...OUT}>
            GAUGAMELA
          </text>
        </g>
        <g opacity={prog(frame, 176, 196)}>
          <text x={960} y={690} textAnchor="middle" fontSize={84} letterSpacing={10} fill={GOLD} fontFamily={FONT_STENCIL} {...OUT} strokeWidth={12}>
            331 SM
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};