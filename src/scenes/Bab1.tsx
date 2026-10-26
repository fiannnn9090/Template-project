import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  BLUE,
  CREAM,
  Dots,
  FONT_SERIF,
  FONT_STENCIL,
  GOLD,
  INK,
  LightBeams,
  RED,
  SoldierDefs,
  Tag,
  clamp,
  fadeIO,
  pop,
  prog,
} from "./common";

import { AlexanderBust, AlexanderFull } from "./Alexander";
import { Camp, Ground, Peaks } from "./Scenery";  


const Bab1Defs: React.FC = () => (
  <>
    <defs>
      <linearGradient id="b1-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6d5668" />
        <stop offset="1" stopColor="#f0b988" />
      </linearGradient>
      <radialGradient id="b1-sun" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff1c9" />
        <stop offset="0.45" stopColor="#ffe3b0" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffe3b0" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="b1-dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6d5668" />
        <stop offset="1" stopColor="#f0b988" />
      </linearGradient>
      <radialGradient id="b1-vig" cx="50%" cy="50%" r="75%">
        <stop offset="0.6" stopColor="#0d0907" stopOpacity="0" />
        <stop offset="1" stopColor="#0d0907" stopOpacity="0.55" />
      </radialGradient>
      <marker
        id="b1-head"
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
    <SoldierDefs />
  </>
);

const NavyBg: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#1d2838" />
    {Array.from({ length: 13 }, (_, i) => (
      <line key={`v${i}`} x1={i * 160} y1={0} x2={i * 160} y2={1080} stroke="#2b394d" strokeWidth={2} />
    ))}
    {Array.from({ length: 8 }, (_, i) => (
      <line key={`h${i}`} x1={0} y1={i * 160} x2={1920} y2={i * 160} stroke="#2b394d" strokeWidth={2} />
    ))}
    <rect width={1920} height={1080} fill="url(#b1-vig)" />
  </g>
);

// ---------- Adegan 1: lapangan ----------
const camAt = (frame: number) => {
  const f = [0, 150, 330, 470, 708, 820];
  const opts = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  return {
    cx: interpolate(frame, f, [520, 560, 1500, 1200, 1250, 560], opts),
    z: interpolate(frame, f, [1.7, 1.7, 1.0, 0.85, 0.85, 1.4], opts),
    cy: 700,
  };
};

type Cam = ReturnType<typeof camAt>;

const Layer: React.FC<{ cam: Cam; f: number; children: React.ReactNode }> = ({
  cam,
  f,
  children,
}) => (
  <g transform={`translate(960 540) scale(${cam.z}) translate(${-cam.cx * f} ${-cam.cy})`}>
    {children}
  </g>
);

const Chariot: React.FC<{ x: number; y: number; frame: number; o: number }> = ({
  x,
  y,
  frame,
  o,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-30} y={-26} width={52} height={24} rx={5} fill="#7a2a1a" />
    <rect x={-40} y={-36} width={12} height={16} rx={3} fill="#5a1f14" />
    <g transform={`translate(0 6) rotate(${frame * 8})`}>
      <circle r={20} fill="#c9a374" stroke="#3a2412" strokeWidth={4} />
      {[0, 60, 120].map((a) => (
        <line key={a} x1={0} y1={-20} x2={0} y2={20} stroke="#3a2412" strokeWidth={3} transform={`rotate(${a})`} />
      ))}
      <path d="M-4,-20 L0,-33 L4,-20 Z" fill="#d6d6d6" />
      <path d="M-4,20 L0,33 L4,20 Z" fill="#d6d6d6" />
    </g>
  </g>
);

const FieldScene: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const cam = camAt(frame);
  const o = fadeIO(frame, total, 24, 30);

  const army: React.ReactNode[] = [];
  [720, 756, 792, 828].forEach((ry, r) => {
    for (let c = 0; c < 32; c++) {
      const x = 1500 + c * 24 + (r % 2) * 12;
      const bob = Math.sin((frame + c * 5 + r * 9) / 10) * 1.2;
      army.push(<use key={`p-${r}-${c}`} href="#sold-per" x={x} y={ry + bob} />);
    }
  });

  const makVis = pop(frame, 410, 24);
  const mak: React.ReactNode[] = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 6; c++) {
      const x = 640 + c * 30;
      const y = 800 + r * 32;
      const bob = Math.sin((frame + c * 7 + r * 11) / 10) * 1.2;
      mak.push(
        <g key={`m-${r}-${c}`} transform={`translate(${x} ${y + bob}) scale(${1.3 * makVis})`}>
          <use href="#sold-mak" />
        </g>
      );
    }
  }

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Bab1Defs />
        {/* Langit dan matahari (tidak ikut parallax) */}
        <rect width={1920} height={1080} fill="url(#b1-sky)" />
        <circle cx={1400} cy={330} r={170} fill="url(#b1-sun)" />

        <Layer cam={cam} f={0.4}>
          <Peaks y={650} xs={[-500, -200, 100, 400, 700, 1000, 1300, 1600]} />
          <path
            d="M-1500,1200 L-1500,650 Q-900,560 -300,640 T900,620 T2100,650 T3300,610 T4500,650 L4500,1200 Z"
            fill="#8c6b66"
          />
        </Layer>
        <Layer cam={cam} f={0.65}>
          <path
            d="M-1500,1200 L-1500,690 Q-800,640 -100,700 T1200,680 T2500,710 T3800,670 T5000,700 L5000,1200 Z"
            fill="#a98066"
          />
        </Layer>

        <Layer cam={cam} f={1}>
            <Camp x={90} y={780} flag="#2c63c9" frame={frame} s={0.7} />
            <Ground pts={[[-100, 900], [350, 960], [820, 940]]} />
          {/* Dataran dan area yang diratakan */}
          <rect x={-2000} y={700} width={7000} height={800} fill="#c9a374" />
          <ellipse
            cx={1500}
            cy={800}
            rx={950}
            ry={150}
            fill="#dcc196"
            opacity={0.7 * prog(frame, 480, 560)}
          />
          
            <Camp x={1560} y={705} flag="#b3262b" frame={frame} s={0.9} />
            <Ground pts={[[1100, 900], [1250, 840], [1400, 960], [2400, 800], [2500, 900], [2650, 840], [1700, 980], [2000, 1000], [2300, 960]]} />

          {/* Panji Persia */}
          {[1700, 1900, 2100].map((bx) => (
            <g key={bx}>
              <line x1={bx} y1={720} x2={bx} y2={590} stroke="#4a3426" strokeWidth={5} />
              <path d={`M${bx},592 L${bx + 70},604 L${bx},636 Z`} fill="#a8322d" />
            </g>
          ))}

          {army}

          {[735, 790, 845, 900].map((cy, i) => (
            <Chariot
              key={cy}
              x={1340}
              y={cy}
              frame={frame}
              o={prog(frame, 560 + i * 15, 590 + i * 15)}
            />
          ))}

          {/* Bukit tempat sang raja berdiri */}
          <path
            d="M-400,1100 L-400,820 Q200,740 520,760 Q800,780 1000,900 L1000,1100 Z"
            fill="#7b5a3e"
          />
          {mak}
            <AlexanderFull x={520} y={499} s={0.45} frame={frame} />

          {/* Label */}
          <Tag x={700} y={455} text="25 TAHUN" s={pop(frame, 40)} o={1 - prog(frame, 220, 250)} />
          <Tag x={1880} y={600} text="PASUKAN PERSIA" s={pop(frame, 150)} o={1 - prog(frame, 640, 680)} />
          <Tag x={715} y={740} text="PASUKAN ANDA" s={pop(frame, 410)} o={1 - prog(frame, 640, 680)} />
          <Tag x={1500} y={985} text="TANAH DIRATAKAN" s={pop(frame, 500)} o={1 - prog(frame, 700, 740)} />
          <Tag x={1340} y={680} text="KERETA PERANG" s={pop(frame, 580)} o={1 - prog(frame, 700, 740)} />
        </Layer>

        <LightBeams frame={frame} opacity={0.1} />
        <rect width={1920} height={1080} fill="url(#b1-vig)" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Adegan 2: kartu judul ----------
const TitleScene: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const o = fadeIO(frame, total, 24, 30);
  const z1 = 1 - prog(frame, 400, 440);
  const z2 = 1 - prog(frame, 410, 440);
  const strike1 = prog(frame, 340, 365);
  const strike2 = prog(frame, 390, 415);
  const sPlace = prog(frame, 140, 170);
  const underline = prog(frame, 440, 480);

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Bab1Defs />
        <NavyBg />
        <LightBeams frame={frame} opacity={0.08} />

        <g opacity={z1}>
          <g transform={`translate(130 360) scale(${pop(frame, 20, 24)})`}>
            <text fontSize={200} fill={CREAM} fontFamily={FONT_STENCIL}>
              331 SM
            </text>
          </g>

          <g transform={`translate(${-300 * (1 - sPlace)} 0)`} opacity={sPlace}>
            <g transform="translate(170 470)">
              <path
                d="M0,-44 C-26,-44 -40,-24 -40,-6 C-40,20 0,56 0,56 C0,56 40,20 40,-6 C40,-24 26,-44 0,-44 Z"
                fill={RED}
              />
              <circle cx={0} cy={-8} r={14} fill={CREAM} />
            </g>
            <text x={250} y={510} fontSize={110} fill={GOLD} fontFamily={FONT_STENCIL}>
              GAUGAMELA
            </text>
          </g>

          {/* Callout raja muda */}
          <g transform={`translate(1440 340) scale(${pop(frame, 220, 24)})`}>
            <clipPath id="b1-king-clip">
              <circle r={190} />
            </clipPath>
            <circle r={230} fill={CREAM} />
            <path d="M-210,70 L-340,150 L-195,170 Z" fill={CREAM} />
            <g clipPath="url(#b1-king-clip)">
              <rect x={-200} y={-200} width={400} height={400} fill="url(#b1-dusk)" />
              <circle cx={90} cy={-70} r={46} fill="#ffe3b0" />
              <path d="M-200,80 Q-100,30 0,70 T200,60 L200,200 L-200,200 Z" fill="#a98066" />
                 <AlexanderBust x={0} y={20} s={0.85} frame={frame} />
            </g>
          </g>
          <Tag x={1440} y={640} text="RAJA MUDA MAKEDONIA" s={pop(frame, 240)} />
        </g>

        {/* Bukan jumlah, bukan keberuntungan */}
        <g opacity={z2}>
          <text
            x={520}
            y={690}
            textAnchor="middle"
            fontSize={34}
            fontStyle="italic"
            fill={CREAM}
            fontFamily={FONT_SERIF}
            opacity={prog(frame, 313, 330)}
          >
            bukan karena
          </text>
          <text
            x={520}
            y={780}
            textAnchor="middle"
            fontSize={96}
            fill={CREAM}
            fontFamily={FONT_STENCIL}
            opacity={prog(frame, 313, 333)}
          >
            JUMLAH
          </text>
          {strike1 > 0.01 ? (
            <line x1={355} y1={750} x2={355 + 330 * strike1} y2={750} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          ) : null}

          <text
            x={1310}
            y={690}
            textAnchor="middle"
            fontSize={34}
            fontStyle="italic"
            fill={CREAM}
            fontFamily={FONT_SERIF}
            opacity={prog(frame, 354, 370)}
          >
            dan bukan karena
          </text>
          <text
            x={1310}
            y={780}
            textAnchor="middle"
            fontSize={96}
            fill={CREAM}
            fontFamily={FONT_STENCIL}
            opacity={prog(frame, 354, 374)}
          >
            KEBERUNTUNGAN
          </text>
          {strike2 > 0.01 ? (
            <line x1={985} y1={750} x2={985 + 650 * strike2} y2={750} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          ) : null}
        </g>

        {/* Rencana */}
        {frame >= 410 ? (
          <g>
            <g transform={`translate(960 470) scale(${pop(frame, 410, 26)})`}>
              <text textAnchor="middle" fontSize={260} fill={GOLD} fontFamily={FONT_STENCIL}>
                RENCANA
              </text>
            </g>
            <rect x={960 - 490 * underline} y={510} width={980 * underline} height={14} rx={7} fill={CREAM} />
            <Tag x={560} y={700} text="BERANI" s={pop(frame, 476, 20)} />
            <Tag x={960} y={700} text="NYARIS NEKAT" s={pop(frame, 503, 20)} />
            <Tag x={1380} y={700} text="PRESISI" s={pop(frame, 530, 20)} />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Adegan 3: tiga langkah ----------
const MiniDiagram: React.FC<{ kind: 0 | 1 | 2; t: number }> = ({ kind, t }) => {
  if (kind === 0) {
    const pb = prog(t, 10, 90);
    return (
      <g>
        <Dots cx={45 * prog(t, 40, 120)} cy={-70} rows={3} cols={6} gap={20} fill={RED} />
        <Dots cx={55 * pb} cy={70} rows={3} cols={6} gap={20} fill={BLUE} />
        {pb > 0.02 ? (
          <line
            x1={-50}
            y1={115}
            x2={-50 + 110 * pb}
            y2={115 - 45 * pb}
            stroke={INK}
            strokeWidth={8}
            strokeLinecap="round"
            markerEnd="url(#b1-head)"
          />
        ) : null}
      </g>
    );
  }
  const sp = kind === 1 ? prog(t, 0, 70) : 1;
  const xl = -55 - 30 * sp;
  const xr = 55 + 30 * sp;
  const edgeL = xl + 39;
  const edgeR = xr - 39;
  if (kind === 1) {
    return (
      <g>
        <Dots cx={xl} cy={-50} rows={3} cols={5} gap={16} fill={RED} />
        <Dots cx={xr} cy={-50} rows={3} cols={5} gap={16} fill={RED} />
        <rect
          x={edgeL}
          y={-85}
          width={edgeR - edgeL}
          height={70}
          rx={10}
          fill="none"
          stroke="#8a1c1c"
          strokeWidth={4}
          strokeDasharray="10 8"
        />
        <Dots cx={0} cy={85} rows={3} cols={7} gap={16} fill={BLUE} />
      </g>
    );
  }
  const mv = prog(t, 0, 90);
  return (
    <g>
      <Dots cx={xl} cy={-50} rows={3} cols={5} gap={16} fill={RED} />
      <Dots cx={xr} cy={-50} rows={3} cols={5} gap={16} fill={RED} />
      <circle cx={0} cy={-100} r={16} fill={GOLD} stroke={INK} strokeWidth={3} />
      <Dots cx={0} cy={90 - 100 * mv} rows={3} cols={5} gap={16} fill={BLUE} />
      {mv > 0.02 ? (
        <line
          x1={0}
          y1={150}
          x2={0}
          y2={150 - 190 * mv}
          stroke={INK}
          strokeWidth={8}
          strokeLinecap="round"
          markerEnd="url(#b1-head)"
        />
      ) : null}
    </g>
  );
};

const StepsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const o = prog(frame, 0, 24);
  const cards: { cx: number; start: number; label: string; kind: 0 | 1 | 2 }[] = [
    { cx: 480, start: 150, label: "1 · MEMANCING", kind: 0 },
    { cx: 960, start: 218, label: "2 · CELAH", kind: 1 },
    { cx: 1440, start: 286, label: "3 · MENUSUK", kind: 2 },
  ];

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Bab1Defs />
        <NavyBg />
        <LightBeams frame={frame} opacity={0.08} />

        <g transform={`translate(960 190) scale(${pop(frame, 10, 24)})`}>
          <text textAnchor="middle" fontSize={110} fill={CREAM} fontFamily={FONT_STENCIL}>
            TAKTIK ALEXANDER AGUNG
          </text>
        </g>
        <g transform={`translate(960 275) scale(${pop(frame, 40, 24)})`}>
          <text textAnchor="middle" fontSize={56} letterSpacing={4} fill={GOLD} fontFamily={FONT_STENCIL}>
            PERTEMPURAN GAUGAMELA
          </text>
        </g>

        {cards.map((c, i) => {
          if (frame < c.start) return null;
          const t = frame - c.start;
          return (
            <g key={i} transform={`translate(${c.cx} 600) scale(${pop(frame, c.start, 22)})`}>
              <circle r={190} fill={CREAM} />
              <clipPath id={`b1-card-${i}`}>
                <circle r={170} />
              </clipPath>
              <g clipPath={`url(#b1-card-${i})`}>
                <rect x={-170} y={-170} width={340} height={340} fill="#d9bd8f" />
                <MiniDiagram kind={c.kind} t={t} />
              </g>
              <text
                y={248}
                textAnchor="middle"
                fontSize={50}
                letterSpacing={2}
                fill={CREAM}
                fontFamily={FONT_STENCIL}
              >
                {c.label}
              </text>
            </g>
          );
        })}

        <g transform={`translate(960 1010) scale(${pop(frame, 400, 24)})`}>
          <text textAnchor="middle" fontSize={46} fontStyle="italic" fill={CREAM} fontFamily={FONT_SERIF}>
            selangkah demi selangkah
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const Bab1Scene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#1d2838" }}>
      <Sequence from={1} durationInFrames={830}>
        <FieldScene total={830} />
      </Sequence>
      <Sequence from={790} durationInFrames={640}>
        <TitleScene total={640} />
      </Sequence>
      <Sequence from={1400} durationInFrames={523}>
        <StepsScene />
      </Sequence>
    </AbsoluteFill>
  );
};