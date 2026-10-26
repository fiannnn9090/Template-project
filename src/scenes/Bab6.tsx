import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BLUE, FONT_STENCIL, GOLD, INK, RED, Tag, pop, prog } from "./common";
import { CommanderView, Defs, FormationView, MapBackground } from "../battle/Battle";
import type { Commander, Formation, KF } from "../battle/units";
import { Arr } from "./Bab4";
import { Camp, Peaks } from "./Scenery";
import { SUBS } from "../subtitles";

const S = SUBS[5].map(([f]) => f);
const END = 2000;

type P = [number, number, number, number]; // [frame, x, y, opacity]
const K = (a: P[]): KF[] => a.map(([f, x, y, o]) => ({ f, x, y, o }));
const M = (
  id: string,
  side: Formation["side"],
  kind: Formation["kind"],
  rows: number,
  cols: number,
  gap: number,
  kfs: P[],
  banner?: string,
  below?: boolean
): Formation => ({ id, side, kind, rows, cols, gap, banner, bannerBelow: below, kfs: K(kfs) });

const FORMS: Formation[] = [
  M("per-kanan", "per", "cav", 3, 9, 26, [[0, 480, 380, 0], [20, 480, 380, 1], [S[2], 480, 380, 1], [S[2] + 60, 480, 650, 1], [S[9], 480, 650, 1], [S[9] + 100, 480, 420, 0.2]], "Pasukan Mazaeus"),
  M("per-a", "per", "cav", 2, 6, 24, [[0, 240, 560, 0], [S[3], 240, 560, 0], [S[3] + 20, 240, 560, 1], [S[3] + 70, 330, 700, 1], [S[9], 330, 700, 1], [S[9] + 100, 200, 500, 0.2]]),
  M("per-b", "per", "cav", 2, 6, 24, [[0, 700, 560, 0], [S[3], 700, 560, 0], [S[3] + 20, 700, 560, 1], [S[3] + 70, 600, 720, 1], [S[9], 600, 720, 1], [S[9] + 100, 760, 520, 0.2]]),
  M("penerobos", "per", "cav", 2, 7, 26, [[0, 760, 600, 0], [S[5], 760, 600, 0], [S[5] + 20, 760, 600, 1], [S[5] + 140, 300, 870, 1], [S[9], 300, 870, 1], [S[9] + 100, 560, 640, 0.2]], "Kavaleri Persia & India"),
  M("phalanx", "mak", "inf", 4, 20, 18, [[0, 1000, 430, 0], [20, 1000, 430, 1], [END, 1000, 430, 1]], "Phalanx"),
  M("thessalia", "mak", "cav", 2, 7, 26, [[0, 480, 740, 0], [20, 480, 740, 1], [END, 480, 740, 1]], "Kavaleri Thessalia"),
  M("cadangan", "mak", "inf", 2, 12, 20, [[0, 560, 900, 0], [S[6], 560, 900, 0], [S[6] + 20, 560, 900, 1], [END, 560, 900, 1]], "Lapis kedua", true),
  M("companion", "mak", "cav", 2, 8, 26, [[0, 1010, 320, 0], [20, 1010, 320, 1], [S[8], 1010, 320, 1], [S[8] + 120, 700, 640, 1], [END, 700, 640, 1]]),
];

const ALEX: Commander = {
  id: "alexander",
  name: "ALEXANDER",
  subtitle: "Companion",
  side: "mak",
  kfs: K([[0, 1010, 215, 0], [20, 1010, 215, 1], [S[8], 1010, 215, 1], [S[8] + 120, 700, 535, 1], [END, 700, 535, 1]]),
};

const SHELF = ["#7a3b2e", "#2f5d62", "#8a6a2f", "#40384f", "#5a7a3a", "#a14a3a"];
const NAMES = ["ARRIAN", "CURTIUS", "DIODORUS", "PLUTARCH"];
const ORDERS = [[RED, BLUE, GOLD], [BLUE, RED, GOLD], [GOLD, BLUE, RED]];

const Book: React.FC<{ frame: number }> = ({ frame }) => {
  const bo = prog(frame, S[10], S[10] + 30);
  if (bo <= 0) return null;
  return (
    <g opacity={bo}>
      <rect width={1920} height={1080} fill="#2b1d14" />
      {Array.from({ length: 40 }, (_, i) => (
        <g key={i} opacity={0.55}>
          <rect x={i * 48 + 4} y={60 + (i % 3) * 14} width={38} height={250 - (i % 3) * 14} fill={SHELF[i % 6]} />
          <rect x={i * 48 + 4} y={790} width={38} height={220 - (i % 4) * 12} fill={SHELF[(i + 2) % 6]} />
        </g>
      ))}
      <rect width={1920} height={1080} fill="#000" opacity={0.35} />

      <rect x={300} y={180} width={1320} height={650} rx={24} fill="#5a3b24" />
      <rect x={330} y={200} width={620} height={600} rx={12} fill="#efe3c8" />
      <rect x={970} y={200} width={620} height={600} rx={12} fill="#efe3c8" />
      <rect x={950} y={200} width={20} height={600} fill="#c9b78f" />

      <g transform={`translate(640 290) scale(${pop(frame, S[10] + 10)})`}>
        <text textAnchor="middle" fontSize={64} fill={INK} fontFamily={FONT_STENCIL}>SUMBER KUNO</text>
      </g>
      {NAMES.map((n, i) => {
        const y = 390 + i * 95;
        return (
          <g key={n} opacity={prog(frame, S[11] + i * 28, S[11] + i * 28 + 14)}>
            <text x={380} y={y} fontSize={44} fill={INK} fontFamily={FONT_STENCIL}>{n}</text>
            <path d={`M380,${y + 22} q30,-14 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0`} fill="none" stroke="#9b8b72" strokeWidth={5} strokeLinecap="round" />
          </g>
        );
      })}

      <g transform={`translate(1280 290) scale(${pop(frame, S[10] + 40)})`}>
        <text textAnchor="middle" fontSize={52} fill={INK} fontFamily={FONT_STENCIL}>TIDAK SELALU SEPAKAT</text>
      </g>
      {ORDERS.map((row, i) => (
        <g key={i} opacity={prog(frame, S[11] + 60 + i * 20, S[11] + 80 + i * 20)}>
          {row.map((c, j) => (
            <rect key={j} x={1000 + j * 190} y={370 + i * 95} width={170} height={52} rx={8} fill={c} stroke={INK} strokeWidth={4} />
          ))}
        </g>
      ))}

      {frame >= S[12] ? (
        <g transform={`translate(1280 700) rotate(-6) scale(${pop(frame, S[12], 22)})`}>
          <rect x={-270} y={-62} width={540} height={124} rx={12} fill="none" stroke="#8a1c1c" strokeWidth={7} />
          <text y={-8} textAnchor="middle" fontSize={44} fill="#8a1c1c" fontFamily={FONT_STENCIL}>REKONSTRUKSI UMUM</text>
          <text y={42} textAnchor="middle" fontSize={34} fill="#8a1c1c" fontFamily={FONT_STENCIL}>BUKAN SATU-SATUNYA</text>
        </g>
      ) : null}
    </g>
  );
};

export const Bab6Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const tagO = 1 - prog(frame, S[10], S[10] + 20);
  const gapO = prog(frame, S[4], S[4] + 25) * tagO;
  const tags: [number, number, string][] = [
    [S[2], 560, "TEKANAN DI SAYAP KIRI"],
    [S[4], 640, "CELAH DI BARISAN"],
    [S[5], 720, "PENEROBOSAN KE KAMP"],
    [S[6], 800, "LAPIS KEDUA MENAHAN"],
    [S[8], 880, "ALEXANDER KEMBALI MENOLONG"],
  ];

  return (
    <AbsoluteFill style={{ opacity: prog(frame, 0, 20) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Defs />
        <MapBackground />
        <Peaks y={150} xs={[100, 300, 500, 700, 900, 1100, 1300, 1500, 1700, 1900]} />
        <Camp x={90} y={870} flag="#2c63c9" frame={frame} />

        <g opacity={gapO}>
          <rect x={640} y={520} width={260} height={200} rx={16} fill="#ffffff" fillOpacity={0.18} stroke="#8a1c1c" strokeWidth={4} strokeDasharray="14 10" />
          <text x={770} y={630} textAnchor="middle" fontSize={40} letterSpacing={4} fill="#8a1c1c" fontFamily={FONT_STENCIL}>CELAH</text>
        </g>

        {FORMS.map((f) => (
          <FormationView key={f.id} f={f} />
        ))}
        <CommanderView c={ALEX} />

        <Arr a={[600, 860]} b={[400, 870]} at={S[7]} frame={frame} />
        <Arr a={[1010, 330]} b={[700, 610]} at={S[8] + 60} frame={frame} />

        {tags.map(([at, y, t]) => (
          <Tag key={t} x={1550} y={y} text={t} s={pop(frame, at)} o={tagO} />
        ))}

        <Book frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};