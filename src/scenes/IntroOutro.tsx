import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CREAM, FONT_SERIF, FONT_STENCIL, GOLD, LightBeams, Tag, fadeIO, pop, prog } from "./common";
import { CommanderView, Defs, FormationView, MapBackground } from "../battle/Battle";
import type { Commander, Formation, KF } from "../battle/units";
import { AlexanderBust } from "./Alexander";
import { Camp, Peaks } from "./Scenery";

const CHANNEL = ""; // isi nama kanalmu agar tampil di intro dan outro

const OUT = {
  stroke: "#1c130a",
  strokeWidth: 14,
  strokeLinejoin: "round",
  paintOrder: "stroke",
} as const;

const mk = (
  id: string,
  side: Formation["side"],
  kind: Formation["kind"],
  rows: number,
  cols: number,
  gap: number,
  kfs: KF[],
  banner?: string
): Formation => ({ id, side, kind, rows, cols, gap, banner, kfs });

// Pasukan muncul di frame 30, lalu bergeser pelan sampai frame 450.
const glide = (x0: number, y0: number, x1: number, y1: number): KF[] => [
  { f: 0, x: x0, y: y0, o: 0 },
  { f: 30, x: x0, y: y0, o: 1 },
  { f: 450, x: x1, y: y1, o: 1 },
];

const FORMS: Formation[] = [
  mk("per", "per", "inf", 6, 26, 20, glide(1300, 470, 1180, 500), "Persia"),
  mk("per-kav", "per", "cav", 3, 9, 26, glide(1700, 590, 1600, 600)),
  mk("phalanx", "mak", "inf", 4, 20, 18, glide(560, 760, 700, 760), "Makedonia"),
  mk("companion", "mak", "cav", 2, 8, 26, glide(1000, 760, 1160, 760)),
];

const ALEX: Commander = {
  id: "alexander",
  name: "ALEXANDER",
  subtitle: "Companion",
  side: "mak",
  kfs: glide(1000, 655, 1160, 655),
};

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = 1 + 0.06 * prog(frame, 0, 450);

  return (
    <AbsoluteFill style={{ opacity: fadeIO(frame, 450, 20, 20) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Defs />
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
          <MapBackground />
          <Peaks y={420} xs={[100, 320, 560, 820, 1100, 1380, 1640, 1860]} />
          <Camp x={90} y={900} flag="#2c63c9" frame={frame} />
          <Camp x={1560} y={330} flag="#b3262b" frame={frame} s={0.8} />
          {FORMS.map((f) => (
            <FormationView key={f.id} f={f} />
          ))}
          <CommanderView c={ALEX} />
        </g>
        <LightBeams frame={frame} opacity={0.08} />

        <g transform={`translate(960 250) scale(${pop(frame, 30, 26)})`}>
          <text textAnchor="middle" fontSize={210} letterSpacing={6} fill={CREAM} fontFamily={FONT_STENCIL} {...OUT}>
            GAUGAMELA
          </text>
        </g>
        <g transform={`translate(960 340) scale(${pop(frame, 90, 24)})`}>
          <text textAnchor="middle" fontSize={72} letterSpacing={6} fill={GOLD} fontFamily={FONT_STENCIL} {...OUT} strokeWidth={12}>
            TAKTIK ALEXANDER AGUNG
          </text>
        </g>
        <Tag x={640} y={430} text="331 SM" s={pop(frame, 150)} />
        {CHANNEL ? (
          <text x={960} y={1040} textAnchor="middle" fontSize={34} letterSpacing={4} fill={GOLD} fontFamily={FONT_STENCIL} {...OUT} strokeWidth={10}>
            {CHANNEL}
          </text>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ opacity: fadeIO(frame, 450, 20, 30) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Defs />
        <MapBackground />
        <rect width={1920} height={1080} fill="#0d0907" opacity={0.72} />
        <LightBeams frame={frame} opacity={0.08} />

        <g transform={`translate(500 520) scale(${pop(frame, 20, 24)})`}>
          <circle r={270} fill={CREAM} />
          <clipPath id="out-por">
            <circle r={246} />
          </clipPath>
          <g clipPath="url(#out-por)">
            <rect x={-250} y={-250} width={500} height={500} fill="#d9bd8f" />
            <AlexanderBust x={0} y={30} s={1.15} frame={frame} />
          </g>
        </g>

        <g transform={`translate(1290 300) scale(${pop(frame, 40, 24)})`}>
          <text textAnchor="middle" fontSize={120} letterSpacing={4} fill={CREAM} fontFamily={FONT_STENCIL}>
            TERIMA KASIH
          </text>
        </g>
        <g transform={`translate(1290 390) scale(${pop(frame, 60, 24)})`}>
          <text textAnchor="middle" fontSize={84} letterSpacing={4} fill={GOLD} fontFamily={FONT_STENCIL}>
            SUDAH MENONTON
          </text>
        </g>
        <g opacity={prog(frame, 100, 120)}>
          <text x={1290} y={520} textAnchor="middle" fontSize={46} fontStyle="italic" fill={CREAM} fontFamily={FONT_SERIF}>
            Pertempuran sejarah mana
          </text>
          <text x={1290} y={580} textAnchor="middle" fontSize={46} fontStyle="italic" fill={CREAM} fontFamily={FONT_SERIF}>
            yang ingin kamu lihat berikutnya?
          </text>
        </g>
        <Tag x={1290} y={680} text="TULIS DI KOLOM KOMENTAR" s={pop(frame, 150)} />
        {["LIKE", "SUBSCRIBE", "BAGIKAN"].map((t, i) => (
          <Tag key={t} x={1040 + i * 250} y={800} text={t} s={pop(frame, 210 + i * 25)} />
        ))}

        <text x={960} y={1000} textAnchor="middle" fontSize={28} fill={CREAM} opacity={0.7 * prog(frame, 300, 330)} fontFamily={FONT_SERIF}>
          Sumber: Arrian, Curtius, Diodorus, Plutarch
        </text>
        {CHANNEL ? (
          <text x={960} y={1050} textAnchor="middle" fontSize={34} letterSpacing={4} fill={GOLD} fontFamily={FONT_STENCIL} opacity={prog(frame, 330, 360)}>
            {CHANNEL}
          </text>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};