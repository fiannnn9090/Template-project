import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CAPTIONS, CARDS, COMMANDERS, FORMATIONS, PHASE } from "./units";
import type { Commander, Formation, KF, Side } from "./units";
import { AlexanderFace } from "../scenes/Alexander";

const FONT_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_STENCIL = "Impact, 'Arial Black', sans-serif";
const INK = "#2a1a0a";
const MAK = "#2c63c9";
const PER = "#b3262b";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Nilai x / y / opacity suatu keyframe track pada frame tertentu.
const track = (frame: number, kfs: KF[], key: "x" | "y" | "o"): number =>
  interpolate(
    frame,
    kfs.map((k) => k.f),
    kfs.map((k) => (key === "o" ? k.o ?? 1 : k[key])),
    { ...clamp, easing: Easing.inOut(Easing.cubic) }
  );

export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="gRed" cx="35%" cy="30%" r="75%">
      <stop offset="0" stopColor="#f26a6a" />
      <stop offset="1" stopColor="#8f1d22" />
    </radialGradient>
    <radialGradient id="gBlue" cx="35%" cy="30%" r="75%">
      <stop offset="0" stopColor="#7db2ff" />
      <stop offset="1" stopColor="#1d4cae" />
    </radialGradient>
    <radialGradient id="gDark" cx="35%" cy="30%" r="75%">
      <stop offset="0" stopColor="#8a4a30" />
      <stop offset="1" stopColor="#3a0f08" />
    </radialGradient>
    <linearGradient id="gRod" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#f4f4f4" />
      <stop offset="0.5" stopColor="#9b9b9b" />
      <stop offset="1" stopColor="#d6d6d6" />
    </linearGradient>
    <radialGradient id="vig" cx="50%" cy="50%" r="75%">
      <stop offset="0.6" stopColor="#1a0f05" stopOpacity="0" />
      <stop offset="1" stopColor="#1a0f05" stopOpacity="0.6" />
    </radialGradient>

    <filter id="sandBlotch" x="0" y="0" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.006 0.012"
        numOctaves="4"
        seed="11"
      />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0.42  0 0 0 0 0.29  0 0 0 0 0.15  0 0 0 1.1 -0.35"
      />
    </filter>
    <filter id="sandGrain" x="0" y="0" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        seed="3"
      />
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0.25  0 0 0 0 0.17  0 0 0 0 0.08  0 0 0 0.9 -0.25"
      />
    </filter>
    <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.01"
        numOctaves="3"
        seed="5"
        result="t"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="t"
        scale="70"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
    <filter id="torn" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.05"
        numOctaves="2"
        seed="9"
        result="t"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="t"
        scale="12"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="3"
        dy="5"
        stdDeviation="4"
        floodColor="#1c1008"
        floodOpacity="0.45"
      />
    </filter>

    <marker
      id="head"
      viewBox="0 0 10 10"
      refX="6"
      refY="5"
      markerWidth="4"
      markerHeight="4"
      orient="auto"
    >
      <path d="M0,0 L10,5 L0,10 z" fill={INK} />
    </marker>
  </defs>
);

export const MapBackground: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#c9a574" />
    <rect width={1920} height={1080} filter="url(#sandBlotch)" opacity={0.55} />
    <rect width={1920} height={1080} filter="url(#sandGrain)" opacity={0.35} />
    <ellipse
      cx={960}
      cy={560}
      rx={800}
      ry={400}
      fill="#dcc196"
      opacity={0.6}
      filter="url(#rough)"
    />
    <text
      x={480}
      y={600}
      textAnchor="middle"
      fontSize={26}
      fontStyle="italic"
      fill="#7d6540"
      fontFamily={FONT_SERIF}
    >
      Dataran yang diratakan
    </text>
    <rect width={1920} height={1080} fill="url(#vig)" />
  </g>
);

const Banner: React.FC<{ x: number; y: number; text: string; side: Side }> = ({
  x,
  y,
  text,
  side,
}) => {
  const w = text.length * 12.5 + 40;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-w / 2}
        y={-19}
        width={w}
        height={38}
        rx={6}
        fill="#efe0b8"
        stroke={side === "mak" ? MAK : PER}
        strokeWidth={4}
      />
      <text
        y={2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={19}
        fontWeight={700}
        letterSpacing={1.5}
        fill={INK}
        fontFamily={FONT_SERIF}
      >
        {text.toUpperCase()}
      </text>
    </g>
  );
};

export const FormationView: React.FC<{ f: Formation }> = ({ f }) => {
  const frame = useCurrentFrame();
  const o = track(frame, f.kfs, "o");
  if (o <= 0.01) return null;

  const cx = track(frame, f.kfs, "x");
  const cy = track(frame, f.kfs, "y");
  const r = f.kind === "cav" ? 11 : f.kind === "chariot" ? 13 : 7.5;
  const fill =
    f.kind === "chariot"
      ? "url(#gDark)"
      : f.side === "mak"
      ? "url(#gBlue)"
      : "url(#gRed)";

  const dots: React.ReactNode[] = [];
  for (let row = 0; row < f.rows; row++) {
    for (let col = 0; col < f.cols; col++) {
      // Tiap baris sedikit tertinggal: barisan depan jalan lebih dulu.
      const delay = row * 4 + ((row * 7 + col * 13) % 6);
      const dx = (col - (f.cols - 1) / 2) * f.gap;
      const dy = (row - (f.rows - 1) / 2) * f.gap;
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={track(frame - delay, f.kfs, "x") + dx}
          cy={track(frame - delay, f.kfs, "y") + dy}
          r={r}
          fill={fill}
          stroke={f.kind === "cav" ? "#ffffff" : "#1b0f08"}
          strokeWidth={f.kind === "cav" ? 3 : 1}
          strokeOpacity={f.kind === "cav" ? 0.9 : 0.6}
        />
      );
    }
  }

  const halfH = ((f.rows - 1) / 2) * f.gap + r + 34;
  const bannerY = f.bannerBelow ? cy + halfH : cy - halfH;

  return (
    <g opacity={o} filter="url(#shadow)">
      {dots}
      {f.banner ? (
        <Banner x={cx} y={bannerY} text={f.banner} side={f.side} />
      ) : null}
    </g>
  );
};

export const CommanderView: React.FC<{ c: Commander }> = ({ c }) => {
  const frame = useCurrentFrame();
  const o = track(frame, c.kfs, "o");
  if (o <= 0.01) return null;
  const x = track(frame, c.kfs, "x");
  const y = track(frame, c.kfs, "y");
  const color = c.side === "mak" ? MAK : PER;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o} filter="url(#shadow)">
      <line
        x1={0}
        y1={64}
        x2={0}
        y2={80}
        stroke="#5b4727"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <rect
        x={-66}
        y={-64}
        width={132}
        height={128}
        rx={8}
        fill="#efe0b8"
        stroke="#b88a2e"
        strokeWidth={5}
      />
      <rect x={-66} y={-64} width={132} height={14} rx={6} fill={color} />
        {c.id === "alexander" ? (
            <AlexanderFace x={0} y={-14} s={0.28} />
        ) : (
            <>
            <circle cx={0} cy={-26} r={20} fill="#14110d" />
            <path d="M-36,16 Q-36,-2 0,-2 Q36,-2 36,16 Z" fill="#14110d" />
            </>
        )}
      <text
        y={c.subtitle ? 36 : 42}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={17}
        fontWeight={700}
        letterSpacing={1}
        fill={INK}
        fontFamily={FONT_SERIF}
      >
        {c.name}
      </text>
      {c.subtitle ? (
        <text
          y={53}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={13}
          fontStyle="italic"
          fill={INK}
          fontFamily={FONT_SERIF}
        >
          {c.subtitle}
        </text>
      ) : null}
    </g>
  );
};

const Arrow: React.FC<{
  from: [number, number];
  to: [number, number];
  draw: [number, number];
  fade: [number, number];
}> = ({ from, to, draw, fade }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, draw, [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const o = interpolate(frame, fade, [1, 0], clamp);
  if (p <= 0 || o <= 0) return null;
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={from[0] + (to[0] - from[0]) * p}
      y2={from[1] + (to[1] - from[1]) * p}
      stroke={INK}
      strokeWidth={9}
      strokeLinecap="round"
      markerEnd="url(#head)"
      opacity={o}
    />
  );
};

const GapHighlight: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(
    frame,
    [
      PHASE.chariots - 250,
      PHASE.chariots - 100,
      PHASE.pressure,
      PHASE.pressure + 176,
    ],
    [0, 1, 1, 0],
    clamp
  );
  if (o <= 0) return null;
  return (
    <g opacity={o}>
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
      <text
        x={1340}
        y={385}
        textAnchor="middle"
        fontSize={40}
        letterSpacing={4}
        fill="#8a1c1c"
        fontFamily={FONT_STENCIL}
      >
        CELAH
      </text>
    </g>
  );
};

const ScrollCard: React.FC<{
  from: number;
  dur: number;
  title: string;
  sub: string;
}> = ({ from, dur, title, sub }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > from + dur) return null;
  const pop = interpolate(frame, [from, from + 18], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const o = interpolate(
    frame,
    [from, from + 10, from + dur - 14, from + dur],
    [0, 1, 1, 0],
    clamp
  );
  const s = 0.7 + 0.3 * pop;
  return (
    <g
      opacity={o}
      transform={`translate(960 540) scale(${s}) translate(-960 -540)`}
      filter="url(#shadow)"
    >
      <rect
        x={440}
        y={400}
        width={1040}
        height={290}
        fill="#e6dcc6"
        fillOpacity={0.93}
      />
      <rect x={400} y={376} width={1120} height={30} rx={15} fill="url(#gRod)" />
      <rect x={400} y={684} width={1120} height={30} rx={15} fill="url(#gRod)" />
      <text
        x={960}
        y={520}
        textAnchor="middle"
        fontSize={92}
        letterSpacing={4}
        fill="#161616"
        fontFamily={FONT_STENCIL}
      >
        {title}
      </text>
      <text
        x={960}
        y={610}
        textAnchor="middle"
        fontSize={36}
        fontStyle="italic"
        fill={INK}
        fontFamily={FONT_SERIF}
      >
        {sub}
      </text>
    </g>
  );
};

const DateRibbon: React.FC = () => (
  <g filter="url(#shadow)">
    <polygon
      points="30,34 560,28 585,66 558,100 572,138 30,142"
      fill="#8f8f8a"
      filter="url(#torn)"
    />
    <text
      x={60}
      y={80}
      fontSize={40}
      fontWeight={700}
      letterSpacing={5}
      fill="#262626"
      fontFamily="'Courier New', monospace"
    >
      GAUGAMELA
    </text>
    <text
      x={60}
      y={124}
      fontSize={34}
      fontWeight={700}
      letterSpacing={5}
      fill="#262626"
      fontFamily="'Courier New', monospace"
    >
      OKTOBER 331 SM
    </text>
  </g>
);

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const current =
    [...CAPTIONS].reverse().find((c) => frame >= c.from) ?? CAPTIONS[0];
  const o = interpolate(frame, [current.from, current.from + 15], [0, 1], clamp);
  const w = current.text.length * 20 + 80;
  return (
    <g opacity={o}>
      <rect
        x={960 - w / 2}
        y={985}
        width={w}
        height={64}
        rx={32}
        fill="#1c130a"
        fillOpacity={0.82}
      />
      <text
        x={960}
        y={1018}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={34}
        fill="#f6ecd2"
        fontFamily={FONT_SERIF}
      >
        {current.text}
      </text>
    </g>
  );
};

export const Bab5Battle: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#c9a574" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Defs />
        <MapBackground />
        <GapHighlight />

        {FORMATIONS.map((f) => (
          <FormationView key={f.id} f={f} />
        ))}
        {COMMANDERS.map((c) => (
          <CommanderView key={c.id} c={c} />
        ))}

        <Arrow
          from={[1330, 860]}
          to={[1580, 770]}
          draw={[PHASE.oblique, PHASE.persianShift]}
          fade={[PHASE.chariots, PHASE.chariots + 60]}
        />
        <Arrow
          from={[1560, 690]}
          to={[1050, 340]}
          draw={[PHASE.wedge, PHASE.pressure]}
          fade={[PHASE.collapse - 100, PHASE.collapse]}
        />

        {CARDS.map((c) => (
          <ScrollCard key={c.title} {...c} />
        ))}

        <DateRibbon />
        <Caption />
      </svg>
    </AbsoluteFill>
  );
};