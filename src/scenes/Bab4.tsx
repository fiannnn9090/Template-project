import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT_STENCIL, GOLD, INK, Tag, pop, prog } from "./common";
import { CommanderView, Defs, FormationView, MapBackground } from "../battle/Battle";
import type { Commander, Formation, KF } from "../battle/units";
import { SUBS } from "../subtitles";
import { Scenery } from "./Scenery";

// Awal tiap kalimat narasi Bab 4 (frame relatif awal bab).
const S = SUBS[3].map(([f]) => f);
const END = 3000;

const F = (
  id: string,
  kind: Formation["kind"],
  rows: number,
  cols: number,
  gap: number,
  x: number,
  y: number,
  at: number,
  banner?: string,
  below?: boolean,
  side: Formation["side"] = "mak"
): Formation => ({
  id,
  side,
  kind,
  rows,
  cols,
  gap,
  banner,
  bannerBelow: below,
  kfs: [
    { f: 0, x, y, o: 0 },
    { f: at, x, y, o: 0 },
    { f: at + 20, x, y, o: 1 },
    { f: END, x, y, o: 1 },
  ],
});

const PER_KIRI: Formation = {
  id: "per-kiri",
  side: "per",
  kind: "cav",
  rows: 3,
  cols: 9,
  gap: 26,
  banner: "Sayap kiri Persia",
  kfs: [
    { f: 0, x: 1450, y: 380, o: 0 },
    { f: S[16], x: 1450, y: 380, o: 0 },
    { f: S[16] + 20, x: 1450, y: 380, o: 1 },
    { f: S[17], x: 1450, y: 380 },
    { f: S[17] + 60, x: 1680, y: 430 },
    { f: END, x: 1680, y: 430 },
  ],
};

const FORMS: Formation[] = [
  F("per-pusat", "inf", 5, 14, 22, 960, 330, S[16], "Pusat Persia", false, "per"),
  PER_KIRI,
  F("phalanx", "inf", 4, 20, 18, 960, 640, S[1], "Phalanx"),
  F("companion", "cav", 2, 8, 26, 1330, 640, S[2]),
  F("thessalia", "cav", 2, 7, 26, 590, 640, S[3], "Kavaleri Thessalia"),
  F("cadangan", "inf", 2, 18, 20, 960, 770, S[6], "Lapis kedua", true),
  F("sayap-kanan", "inf", 5, 2, 18, 1500, 740, S[6]),
  F("sayap-kiri", "inf", 5, 2, 18, 420, 740, S[6]),
  F("ringan", "inf", 2, 6, 18, 1480, 540, S[10], "Pasukan ringan"),
  F("cadangan-kav", "cav", 1, 4, 26, 1650, 560, S[10]),
];

const kfs = (x: number, y: number, at: number): KF[] => [
  { f: 0, x, y, o: 0 },
  { f: at, x, y, o: 0 },
  { f: at + 20, x, y, o: 1 },
  { f: END, x, y, o: 1 },
];

const ALEX: Commander = {
  id: "alexander",
  name: "ALEXANDER",
  subtitle: "Companion",
  side: "mak",
  kfs: kfs(1330, 535, S[2]),
};

export const Arr: React.FC<{ a: [number, number]; b: [number, number]; at: number; frame: number }> = ({
  a,
  b,
  at,
  frame,
}) => {
  const p = prog(frame, at, at + 45);
  if (p < 0.02) return null;
  return (
    <line
      x1={a[0]}
      y1={a[1]}
      x2={a[0] + (b[0] - a[0]) * p}
      y2={a[1] + (b[1] - a[1]) * p}
      stroke={INK}
      strokeWidth={10}
      strokeLinecap="round"
      markerEnd="url(#head)"
    />
  );
};

export const Bab4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const boxO = prog(frame, S[8], S[8] + 25);
  const gapO = prog(frame, S[17], S[17] + 25);
  const dar = pop(frame, S[18], 22);
  const planFade = 1 - prog(frame, S[16], S[16] + 20);
  const encircleFade = 1 - prog(frame, S[11], S[11] + 20);

  return (
    <AbsoluteFill style={{ opacity: prog(frame, 0, 20) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Defs />
        <MapBackground />
        <Scenery frame={frame} />

        {/* Kotak berongga */}
        <rect
          x={340}
          y={480}
          width={1380}
          height={330}
          rx={24}
          fill="none"
          stroke={INK}
          strokeWidth={5}
          strokeDasharray="20 12"
          opacity={boxO}
        />

        {/* Celah di barisan Persia */}
        <g opacity={gapO}>
          <rect
            x={1115}
            y={275}
            width={450}
            height={190}
            rx={16}
            fill="#ffffff"
            fillOpacity={0.18}
            stroke="#8a1c1c"
            strokeWidth={4}
            strokeDasharray="14 10"
          />
          <text x={1340} y={385} textAnchor="middle" fontSize={40} letterSpacing={4} fill="#8a1c1c" fontFamily={FONT_STENCIL}>
            CELAH
          </text>
        </g>

        {FORMS.map((f) => (
          <FormationView key={f.id} f={f} />
        ))}
        <CommanderView c={ALEX} />

        {/* Darius sebagai tujuan */}
        <g transform={`translate(960 175) scale(${dar})`}>
          <circle r={34} fill={GOLD} stroke={INK} strokeWidth={4} />
          <text y={62} textAnchor="middle" fontSize={26} letterSpacing={2} fill={INK} fontFamily={FONT_STENCIL}>
            DARIUS
          </text>
        </g>

        {/* Pengepungan dari empat arah */}
        <g opacity={encircleFade}>
          <Arr a={[960, 330]} b={[960, 475]} at={S[9]} frame={frame} />
          <Arr a={[160, 640]} b={[335, 640]} at={S[9] + 8} frame={frame} />
          <Arr a={[1880, 640]} b={[1725, 640]} at={S[9] + 16} frame={frame} />
          <Arr a={[960, 1010]} b={[960, 815]} at={S[9] + 24} frame={frame} />
        </g>

        {/* Rencana: serong kanan lalu menusuk celah */}
        <Arr a={[1330, 730]} b={[1640, 620]} at={S[14]} frame={frame} />
        <Arr a={[1330, 650]} b={[1010, 215]} at={S[18] + 10} frame={frame} />

        <Tag x={960} y={905} text="LAPIS KEDUA BERBALIK" s={pop(frame, S[7])} o={1 - prog(frame, S[8], S[8] + 20)} />
        <Tag x={960} y={445} text="KOTAK BERONGGA" s={pop(frame, S[8])} o={encircleFade} />
        <Tag x={590} y={470} text="PARMENION: BERTAHAN" s={pop(frame, S[12])} o={planFade} />
        <Tag x={1330} y={420} text="ALEXANDER: SERONG KANAN" s={pop(frame, S[13])} o={planFade} />
      </svg>
    </AbsoluteFill>
  );
};