import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CREAM, FONT_STENCIL, LightBeams, SoldierDefs, Tag, clamp, pop, prog } from "./common";
import { AlexanderFull } from "./Alexander";
import { Camp, Ground, Peaks } from "./Scenery";

const CAPS: [number, string][] = [
  [0, "SIAPA MELAWAN SIAPA"],
  [233, "PERSIA: PASUKAN DARI SELURUH KEKAISARAN"],
  [603, "PENGAWAL KERAJAAN, BAYARAN YUNANI, GAJAH"],
  [740, "200 KERETA PERANG BERSABIT"],
  [891, "JUMLAH PERSIA: SUMBER KUNO BERLEBIHAN"],
  [1138, "ESTIMASI MODERN: JAUH LEBIH SEDIKIT"],
  [1220, "PERSIA TETAP UNGGUL, TERUTAMA KAVALERI"],
  [1330, "MAKEDONIA (MENURUT ARRIAN)"],
  [1549, "PHALANX: TOMBAK SARISA > 5 METER"],
  [1755, "SAYAP, SEKUTU, DAN PASUKAN RINGAN"],
  [2043, "MASALAH: DATARAN TERBUKA, BISA DIKEPUNG"],
  [2385, "PARMENION USUL SERANGAN MALAM"],
  [2453, "ALEXANDER MENOLAK: TERLALU KACAU"],
  [2550, "DARIUS TAKUT DISERANG, PASUKAN BERJAGA"],
  [2756, "FAJAR: PASUKAN PERSIA KELELAHAN"],
];

const Arrow: React.FC<{ a: [number, number]; b: [number, number]; frame: number }> = ({ a, b, frame }) => {
  const p = prog(frame, 2194, 2262);
  const o = 1 - prog(frame, 2276, 2310);
  if (p < 0.02 || o <= 0) return null;
  return (
    <line
      x1={a[0]}
      y1={a[1]}
      x2={a[0] + (b[0] - a[0]) * p}
      y2={a[1] + (b[1] - a[1]) * p}
      stroke="#8a1c1c"
      strokeWidth={10}
      strokeLinecap="round"
      markerEnd="url(#b3-head)"
      opacity={o}
    />
  );
};

export const Bab3Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const sky = interpolateColors(
    frame,
    [0, 2385, 2550, 2742, 2838],
    ["#6d5668", "#6d5668", "#1b2540", "#1b2540", "#c98a6a"]
  );
  const night = interpolate(frame, [2385, 2550, 2742, 2800], [0, 1, 1, 0], clamp);
  const tired = prog(frame, 2756, 2800);
  const cols = Math.round(40 * prog(frame, 233, 877));
  const mc = Math.round(14 * prog(frame, 1371, 1536));
  const sp = prog(frame, 1549, 1600);
  const cap = [...CAPS].reverse().find(([f]) => frame >= f) ?? CAPS[0];
  const w = cap[1].length * 19 + 70;

  const per: React.ReactNode[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < cols; c++) {
      const bob = Math.sin((frame + c * 5 + r * 9) / 10) * 1.2 * (1 - tired);
      per.push(
        <use key={`p${r}-${c}`} href="#sold-per" x={1000 + c * 22 + (r % 2) * 11} y={640 + r * 30 + tired * 8 + bob} />
      );
    }
  }

  const mak: React.ReactNode[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < mc; c++) {
      const x = 240 + c * 26 + (r % 2) * 13;
      const y = 670 + r * 32;
      mak.push(<use key={`m${r}-${c}`} href="#sold-mak" x={x} y={y} />);
      if (r === 0 && sp > 0.02) {
        mak.push(
          <line
            key={`s${c}`}
            x1={x + 9}
            y1={y - 6}
            x2={x + 9 + 80 * sp}
            y2={y - 6 - 70 * sp}
            stroke="#4a3426"
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      }
    }
  }

  return (
    <AbsoluteFill style={{ opacity: prog(frame, 0, 20) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <marker id="b3-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#8a1c1c" />
          </marker>
        </defs>
        <SoldierDefs />

        <rect width={1920} height={1080} fill={sky} />
        <circle cx={1500} cy={200} r={60} fill="#f3ecd2" opacity={night} />
          <Peaks y={560} xs={[100, 320, 560, 1300, 1550, 1800]} />
        <path d="M0,560 Q300,500 600,545 T1200,530 T1920,550 L1920,620 L0,620 Z" fill="#8c6b66" />
        <rect y={580} width={1920} height={500} fill="#c9a374" />
    
    <Camp x={1050} y={620} flag="#b3262b" frame={frame} s={0.7} />
    <Camp x={620} y={620} flag="#2c63c9" frame={frame} s={0.7} />
    <Ground pts={[[200, 880], [120, 830], [700, 960], [980, 900], [1100, 950], [1500, 880], [1800, 960], [1700, 840], [900, 840]]} />
        
        {per}
        {mak}
            {[0, 1, 2].map((i) => (
                <ellipse key={i} cx={((i * 700 + frame * 0.6) % 2200) - 150} cy={120 + i * 60} rx={150} ry={34} fill="#ffffff" opacity={0.18 * (1 - night)} />
            ))}
            {([[700, "#2c63c9"], [980, "#a8322d"]] as [number, string][]).map(([x, c]) => (
                <g key={c}>
                <line x1={x} y1={520} x2={x} y2={640} stroke="#4a3426" strokeWidth={5} />
                <path d={`M${x},522 Q${x + 35 + Math.sin(frame / 8) * 8},526 ${x + 70},540 L${x},570 Z`} fill={c} />
                </g>
            ))}
            <AlexanderFull x={150} y={470} s={0.3} frame={frame} />
            <Tag x={440} y={560} text="MAKEDONIA" s={pop(frame, 30)} o={1 - prog(frame, 200, 230)} />
            <Tag x={1440} y={560} text="PERSIA" s={pop(frame, 60)} o={1 - prog(frame, 200, 230)} />

        <Arrow a={[980, 520]} b={[520, 610]} frame={frame} />
        <Arrow a={[980, 850]} b={[520, 780]} frame={frame} />

        {/* Angka satu juta dicoret */}
        <g opacity={prog(frame, 1015, 1030) * (1 - prog(frame, 1160, 1190))}>
          <text x={1440} y={540} textAnchor="middle" fontSize={120} fill={CREAM} fontFamily={FONT_STENCIL}>
            1.000.000
          </text>
          <line x1={1150} y1={500} x2={1150 + 580 * prog(frame, 1090, 1124)} y2={500} stroke="#e5484d" strokeWidth={14} strokeLinecap="round" />
        </g>

        <Tag x={440} y={540} text="40.000 INFANTERI" s={pop(frame, 1400)} o={1 - prog(frame, 1700, 1730)} />
        <Tag x={440} y={470} text="7.000 KAVALERI" s={pop(frame, 1480)} o={1 - prog(frame, 1700, 1730)} />
        {["COMPANION", "THESSALIA", "SEKUTU YUNANI", "PASUKAN RINGAN"].map((t, i) => (
          <Tag
            key={t}
            x={440}
            y={330 + i * 70}
            text={t}
            s={pop(frame, [1755, 1830, 1892, 1960][i])}
            o={1 - prog(frame, 2043, 2073)}
          />
        ))}

        <rect width={1920} height={1080} fill="#0a1020" opacity={0.4 * night} />
        <LightBeams frame={frame} opacity={0.06} />

        <rect x={960 - w / 2} y={985} width={w} height={64} rx={32} fill="#1c130a" fillOpacity={0.82} />
        <text x={960} y={1018} textAnchor="middle" dominantBaseline="central" fontSize={34} letterSpacing={2} fill={CREAM} fontFamily={FONT_STENCIL}>
          {cap[1]}
        </text>
      </svg>
    </AbsoluteFill>
  );
};