import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  BLUE,
  CREAM,
  Dots,
  FONT_SERIF,
  FONT_STENCIL,
  GOLD,
  INK,
  RED,
  clamp,
  pop,
  prog,
} from "./common";

// ---------- Proyeksi: bujur/lintang -> piksel ----------
type LL = [number, number]; // [bujur, lintang]
const X = (lon: number) => (lon - 18) * (1920 / 36);
const Y = (lat: number) => (44 - lat) * (1080 / 18);
const proj = (ll: LL): [number, number] => [X(ll[0]), Y(ll[1])];
const toPts = (poly: LL[]) =>
  poly.map((ll) => proj(ll).map((v) => v.toFixed(1)).join(",")).join(" ");

// ---------- Data peta (disederhanakan) ----------
const MED: LL[] = [
  [18, 41.0], [19.4, 41.4], [19.4, 40.4], [19.9, 39.7], [20.3, 39.0], [20.5, 38.5],
  [21.2, 37.9], [21.6, 37.4], [21.7, 36.9], [22.4, 36.4], [23.1, 36.6], [22.9, 37.3],
  [23.5, 37.9], [24.0, 37.7], [23.8, 38.3], [23.2, 39.0], [22.9, 39.4], [23.3, 39.9],
  [22.9, 40.5], [23.6, 40.1], [23.9, 40.4], [24.5, 40.9], [25.9, 40.85], [26.2, 40.4],
  [26.1, 39.9], [26.1, 39.2], [26.6, 38.6], [27.1, 38.3], [27.2, 37.6], [27.4, 37.0],
  [28.3, 36.7], [29.1, 36.4], [30.6, 36.2], [31.8, 36.6], [32.6, 36.1], [33.7, 36.2],
  [34.6, 36.8], [35.5, 36.7], [36.2, 36.7], [35.9, 36.0], [35.8, 35.2], [35.5, 34.3],
  [35.3, 33.5], [35.2, 33.2], [34.8, 32.5], [34.4, 31.5], [33.5, 31.2], [32.3, 31.3],
  [31.8, 31.5], [30.9, 31.6], [29.9, 31.2], [28.0, 31.1], [25.2, 31.6], [24.0, 32.1],
  [22.6, 32.8], [21.0, 32.8], [20.1, 32.1], [19.5, 30.8], [18, 30.5],
];
const MARMARA: LL[] = [
  [26.0, 40.05], [26.8, 40.05], [27.5, 40.35], [28.9, 40.35], [29.1, 40.7], [29.1, 41.2],
  [28.9, 41.2], [28.9, 40.9], [28.0, 40.95], [27.0, 40.7], [26.5, 40.5], [26.0, 40.3],
];
const BLACK: LL[] = [
  [28, 44], [41.5, 44], [41.5, 41.6], [40.5, 41.0], [39, 41.0], [36.5, 41.3],
  [35, 42.0], [33, 42.0], [31.5, 41.2], [29.6, 41.2], [29.0, 41.2], [28.0, 42.3],
];
const CASPIAN: LL[] = [
  [47.7, 44], [54, 44], [54, 37.2], [53, 36.8], [51, 36.6], [49.5, 37.4],
  [48.8, 38.5], [49.2, 40.3], [48, 41.8], [47.5, 43],
];
const GULF: LL[] = [
  [48.0, 30.0], [49.0, 30.3], [50.3, 29.5], [51.5, 28.3], [52.8, 27.3], [54.0, 26.8],
  [54.0, 26.0], [50.5, 26.0], [49.6, 27.0], [48.6, 28.0], [48.0, 29.0],
];
const REDSEA: LL[] = [
  [32.6, 30.0], [32.7, 29.0], [33.2, 28.0], [33.8, 27.2], [34.5, 26.0], [36.0, 26.0],
  [35.5, 26.6], [34.6, 27.6], [34.0, 28.2], [33.5, 29.0], [33.0, 30.0],
];
const CYPRUS: LL[] = [
  [32.3, 35.0], [33.0, 35.3], [34.0, 35.6], [34.5, 35.7], [33.9, 35.0], [33.0, 34.6], [32.4, 34.7],
];
const CRETE: LL[] = [
  [23.5, 35.5], [24.5, 35.4], [26.2, 35.2], [26.2, 35.0], [24.5, 34.9], [23.5, 35.2],
];
const EMPIRE: LL[] = [
  [28, 41.5], [42, 41.8], [48, 41.5], [54, 40.5], [54, 27.5], [52, 27.5], [50.5, 29.5],
  [48, 30.2], [46.5, 29.2], [43, 30.6], [39, 31.5], [36, 31.0], [35.0, 29.8], [34.4, 28.2],
  [33.6, 26.0], [24.8, 26.0], [24.8, 31.6], [26.2, 40.3],
];
const NILE: LL[] = [[31.0, 31.5], [31.2, 30.0], [31.2, 28.0], [32.5, 26.0]];
const EUPHRATES: LL[] = [
  [38.6, 39.0], [38.2, 37.5], [38.0, 36.0], [39.5, 35.3], [41.0, 34.6], [43.0, 33.5],
  [44.2, 32.4], [47.4, 31.0], [48.0, 30.0],
];
const TIGRIS: LL[] = [
  [41.0, 38.4], [42.2, 37.3], [43.1, 36.4], [43.6, 35.4], [44.4, 33.3], [45.6, 32.4], [47.4, 31.0],
];

const SEA_PTS = [MED, MARMARA, BLACK, CASPIAN, GULF, REDSEA].map(toPts);
const ISLAND_PTS = [CYPRUS, CRETE].map(toPts);
const RIVER_PTS = [NILE, EUPHRATES, TIGRIS].map(toPts);
const EMPIRE_PTS = toPts(EMPIRE);

// ---------- Kamera ----------
const CAM_F = [0, 134, 300, 540, 590, 740, 873, 905, 985, 1060, 1562, 1640, 1898, 2000, 2418, 2560, 2989];
const CAM_LON = [36, 36, 26.0, 26.0, 26.4, 26.6, 36, 27.8, 27.8, 36.2, 36.2, 33.0, 33.0, 40.5, 42.5, 39.0, 40.5];
const CAM_LAT = [35, 35, 40.2, 40.2, 40.2, 40.2, 36, 39.8, 39.8, 36.8, 36.8, 34.2, 34.2, 35.5, 36.0, 35.5, 36.0];
const CAM_Z = [1.0, 1.0, 2.2, 2.2, 5.0, 5.0, 1.2, 2.6, 2.6, 2.8, 2.8, 1.7, 1.7, 1.8, 2.4, 2.0, 2.2];

const camAt = (frame: number) => {
  const opts = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const lon = interpolate(frame, CAM_F, CAM_LON, opts);
  const lat = interpolate(frame, CAM_F, CAM_LAT, opts);
  return { cx: X(lon), cy: Y(lat), z: interpolate(frame, CAM_F, CAM_Z, opts) };
};
type Cam = ReturnType<typeof camAt>;

const toScreen = (ll: LL, cam: Cam): [number, number] => {
  const [x, y] = proj(ll);
  return [960 + cam.z * (x - cam.cx), 540 + cam.z * (y - cam.cy)];
};

// ---------- Peta dasar ----------
export const MapBase: React.FC<{ empire: number; tint?: string }> = ({ empire, tint = RED }) => (
  <g>
    <rect x={-3000} y={-3000} width={9000} height={9000} fill="#a8ad55" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <line key={`gx${i}`} x1={i * 320} y1={0} x2={i * 320} y2={1080} stroke="#ffffff" strokeOpacity={0.12} strokeWidth={2} />
    ))}
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <line key={`gy${i}`} x1={0} y1={i * 180} x2={1920} y2={i * 180} stroke="#ffffff" strokeOpacity={0.12} strokeWidth={2} />
    ))}
    <polygon
      points={EMPIRE_PTS}
      fill={tint}
      fillOpacity={0.22 * empire}
      stroke={tint}
      strokeOpacity={0.7 * empire}
      strokeWidth={5}
      strokeDasharray="18 12"
    />
    {SEA_PTS.map((p, i) => (
      <polygon key={`c${i}`} points={p} fill="none" stroke="#c3c775" strokeWidth={34} strokeLinejoin="round" />
    ))}
    {SEA_PTS.map((p, i) => (
      <polygon key={`s${i}`} points={p} fill="#9fccc9" stroke="#d3ebe6" strokeWidth={5} strokeLinejoin="round" />
    ))}
    {ISLAND_PTS.map((p, i) => (
      <g key={`i${i}`}>
        <polygon points={p} fill="#bfe0dc" stroke="#bfe0dc" strokeWidth={30} strokeLinejoin="round" />
        <polygon points={p} fill="#a8ad55" stroke="#c3c775" strokeWidth={6} strokeLinejoin="round" />
      </g>
    ))}
    {RIVER_PTS.map((p, i) => (
      <polyline key={`r${i}`} points={p} fill="none" stroke="#9fccc9" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </g>
);

// ---------- Pin, rute, denyut ----------
export const Pin: React.FC<{ at: LL; label?: string; s: number; z: number; o?: number }> = ({
  at,
  label,
  s,
  z,
  o = 1,
}) => {
  if (s <= 0.01) return null;
  const [x, y] = proj(at);
  const w = (label?.length ?? 0) * 15 + 34;
  return (
    <g transform={`translate(${x} ${y}) scale(${s / z})`} opacity={o}>
      <path
        d="M0,0 C-14,-16 -22,-26 -22,-40 C-22,-54 -12,-62 0,-62 C12,-62 22,-54 22,-40 C22,-26 14,-16 0,0 Z"
        fill={RED}
        stroke={INK}
        strokeWidth={3}
      />
      <circle cx={0} cy={-40} r={8} fill={CREAM} />
      {label ? (
        <g transform="translate(32 -62)">
          <rect width={w} height={42} rx={10} fill={CREAM} stroke={INK} strokeWidth={4} />
          <text
            x={w / 2}
            y={22}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={25}
            letterSpacing={1.5}
            fill={INK}
            fontFamily={FONT_STENCIL}
          >
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
};

export const Route: React.FC<{
  pts: LL[];
  frame: number;
  from: number;
  to: number;
  z: number;
  color?: string;
}> = ({ pts, frame, from, to, z, color = INK }) => {
  const p = interpolate(frame, [from, to], [0, 1], clamp);
  if (p <= 0.001) return null;
  const xy = pts.map(proj);
  const lens = xy.slice(1).map((q, i) => Math.hypot(q[0] - xy[i][0], q[1] - xy[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let remain = p * total;
  const out: [number, number][] = [xy[0]];
  for (let i = 0; i < lens.length; i++) {
    if (remain >= lens[i]) {
      out.push(xy[i + 1]);
      remain -= lens[i];
    } else {
      const t = remain / lens[i];
      out.push([
        xy[i][0] + (xy[i + 1][0] - xy[i][0]) * t,
        xy[i][1] + (xy[i + 1][1] - xy[i][1]) * t,
      ]);
      break;
    }
  }
  const head = out[out.length - 1];
  return (
    <g>
      <polyline
        points={out.map((q) => q.join(",")).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={7 / z}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={head[0]} cy={head[1]} r={11 / z} fill={GOLD} stroke={INK} strokeWidth={3 / z} />
    </g>
  );
};

const Pulse: React.FC<{ at: LL; frame: number; z: number }> = ({ at, frame, z }) => {
  const [x, y] = proj(at);
  const t = (frame % 70) / 70;
  return (
    <circle
      cx={x}
      cy={y}
      r={(10 + 50 * t) / z}
      fill="none"
      stroke={RED}
      strokeWidth={4 / z}
      opacity={1 - t}
    />
  );
};

// ---------- Callout lingkaran ----------
const Callout: React.FC<{
  id: string;
  c: [number, number];
  tip: [number, number];
  r: number;
  s: number;
  o: number;
  children: React.ReactNode;
}> = ({ id, c, tip, r, s, o, children }) => {
  const dx = tip[0] - c[0];
  const dy = tip[1] - c[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const base = r * 0.9;
  const w = r * 0.28;
  const b1 = [c[0] + ux * base + nx * w, c[1] + uy * base + ny * w];
  const b2 = [c[0] + ux * base - nx * w, c[1] + uy * base - ny * w];
  return (
    <g opacity={o}>
      <polygon
        points={`${tip[0]},${tip[1]} ${b1[0]},${b1[1]} ${b2[0]},${b2[1]}`}
        fill={CREAM}
        opacity={Math.min(1, s)}
      />
      <g transform={`translate(${c[0]} ${c[1]}) scale(${s})`}>
        <circle r={r + 24} fill={CREAM} />
        <clipPath id={id}>
          <circle r={r} />
        </clipPath>
        <g clipPath={`url(#${id})`}>{children}</g>
      </g>
    </g>
  );
};

const GranicusArt: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-200} y={-200} width={400} height={400} fill="#d9bd8f" />
    <path
      d="M-200,-10 Q-120,-40 -40,-10 T120,-10 T200,-10 L200,50 Q120,80 40,50 T-120,50 T-200,50 Z"
      fill="#7fb7c4"
    />
    <Dots cx={0} cy={-100} rows={3} cols={9} gap={22} fill={RED} />
    <Dots cx={0} cy={140 - 120 * prog(t, 20, 80)} rows={3} cols={7} gap={22} fill={BLUE} />
  </g>
);

const IssusArt: React.FC<{ t: number }> = ({ t }) => {
  const rows = Math.max(1, Math.min(6, Math.ceil(prog(t, 150, 250) * 6)));
  const fade = 1 - 0.6 * prog(t, 300, 400);
  const crownY = -120 - 160 * prog(t, 258, 380);
  return (
    <g>
      <rect x={-200} y={-200} width={400} height={400} fill="#d9bd8f" />
      <rect x={-200} y={-200} width={150} height={400} fill="#8c6b66" />
      <path d="M-195,40 L-150,-40 L-105,40 Z" fill="#6b4f4a" />
      <path d="M-150,-90 L-110,-170 L-70,-90 Z" fill="#6b4f4a" />
      <path d="M-190,120 L-140,40 L-90,120 Z" fill="#6b4f4a" />
      <rect x={75} y={-200} width={125} height={400} fill="#9fccc9" />
      <g opacity={fade}>
        <Dots cx={12} cy={-150 + (rows - 1) * 10} rows={rows} cols={5} gap={20} fill={RED} />
      </g>
      <Dots cx={12} cy={190 - 110 * prog(t, 60, 150)} rows={2} cols={5} gap={20} fill={BLUE} />
      <circle cx={12} cy={crownY} r={14} fill={GOLD} stroke={INK} strokeWidth={3} />
    </g>
  );
};

// ---------- Garis waktu dan keterangan ----------
const Timeline: React.FC<{ frame: number }> = ({ frame }) => {
  const years = ["336", "334", "333", "332", "331"];
  const idx = interpolate(
    frame,
    [0, 134, 200, 540, 590, 985, 1040, 1600, 1660, 1850, 1900],
    [4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4],
    { ...clamp, easing: Easing.inOut(Easing.cubic) }
  );
  return (
    <g>
      <rect x={250} y={970} width={1420} height={90} rx={45} fill="#1c130a" fillOpacity={0.78} />
      <line x1={360} y1={1025} x2={1560} y2={1025} stroke={CREAM} strokeOpacity={0.4} strokeWidth={4} />
      {years.map((y, i) => (
        <g key={y} transform={`translate(${360 + i * 300} 1025)`}>
          <circle r={9} fill={CREAM} />
          <text y={-22} textAnchor="middle" fontSize={26} fill={CREAM} fontFamily={FONT_STENCIL}>
            {y} SM
          </text>
        </g>
      ))}
      <circle cx={360 + idx * 300} cy={1025} r={17} fill={GOLD} stroke={INK} strokeWidth={4} />
    </g>
  );
};

const CAPTIONS: { from: number; text: string }[] = [
  { from: 0, text: "MUNDUR TIGA TAHUN" },
  { from: 302, text: "336 SM · ALEXANDER NAIK TAKHTA" },
  { from: 369, text: "USIANYA BARU DUA PULUH TAHUN" },
  { from: 453, text: "AYAHNYA, PHILIP II, DIBUNUH" },
  { from: 554, text: "334 SM · MENYEBERANGI HELLESPONT" },
  { from: 755, text: "KEKAISARAN PERSIA: DARI MESIR HINGGA INDIA" },
  { from: 890, text: "334 SM · KEMENANGAN DI GRANICUS" },
  { from: 991, text: "333 SM · ISSUS, HADAPI DARIUS III" },
  { from: 1175, text: "MEDAN SEMPIT: JUMLAH TAK BERGUNA" },
  { from: 1428, text: "DARIUS MELARIKAN DIRI" },
  { from: 1562, text: "332 SM · PESISIR MEDITERANIA" },
  { from: 1662, text: "TIRUS DIREBUT SETELAH PENGEPUNGAN" },
  { from: 1763, text: "MASUK KE MESIR" },
  { from: 1830, text: "ALEXANDRIA DIDIRIKAN" },
  { from: 1898, text: "331 SM · DARIUS BELAJAR DARI ISSUS" },
  { from: 2149, text: "DATARAN TERBUKA DI MESOPOTAMIA UTARA" },
  { from: 2300, text: "PASUKAN BESAR BISA BERGERAK BEBAS" },
  { from: 2418, text: "SELAMA DARIUS BERKUASA, PERANG BELUM SELESAI" },
  { from: 2753, text: "MENYEBERANGI EFRAT DAN TIGRIS" },
  { from: 2854, text: "BERBARIS MENUJU DATARAN GAUGAMELA" },
];

const TopCaption: React.FC<{ frame: number }> = ({ frame }) => {
  const cur = [...CAPTIONS].reverse().find((c) => frame >= c.from) ?? CAPTIONS[0];
  const o = prog(frame, cur.from, cur.from + 14);
  const w = cur.text.length * 19 + 70;
  return (
    <g opacity={o}>
      <rect x={960 - w / 2} y={50} width={w} height={64} rx={32} fill="#1c130a" fillOpacity={0.82} />
      <text
        x={960}
        y={83}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={32}
        letterSpacing={2}
        fill={CREAM}
        fontFamily={FONT_STENCIL}
      >
        {cur.text}
      </text>
    </g>
  );
};

// ---------- Adegan ----------
export const Bab2Scene: React.FC = () => {
  const frame = useCurrentFrame() * 1.19;
  const cam = camAt(frame);
  const z = cam.z;
  const o = prog(frame, 0, 20);
  const empire = prog(frame, 755, 873);

  const gauga: LL = [43.3, 36.4];
  const gp = proj(gauga);
  const issus: LL = [36.3, 36.85];
  const granicus: LL = [27.3, 40.1];

  const gScreen = toScreen(granicus, cam);
  const iScreen = toScreen(issus, cam);

  const showA = frame >= 895 && frame <= 1020;
  const showB = frame >= 1165 && frame <= 1580;

  const levelO = prog(frame, 2149, 2230);
  const clusterS = pop(frame, 2300, 24);
  const clusterRows = Math.max(1, Math.min(4, Math.ceil(prog(frame, 2300, 2400) * 4)));

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <radialGradient id="b2-vig" cx="50%" cy="50%" r="75%">
            <stop offset="0.6" stopColor="#0d0907" stopOpacity="0" />
            <stop offset="1" stopColor="#0d0907" stopOpacity="0.5" />
          </radialGradient>
        </defs>

        <g transform={`translate(960 540) scale(${z}) translate(${-cam.cx} ${-cam.cy})`}>
          <MapBase empire={empire} />

          {/* Dataran terbuka di Gaugamela */}
          <ellipse
            cx={gp[0]}
            cy={gp[1] + 12}
            rx={75}
            ry={40}
            fill="#dcc196"
            fillOpacity={0.85 * levelO}
            stroke={INK}
            strokeOpacity={0.5 * levelO}
            strokeWidth={3 / z}
            strokeDasharray={`${10 / z} ${8 / z}`}
          />

          <Route pts={[[26.15, 40.55], [26.5, 39.95]]} frame={frame} from={604} to={655} z={z} />
          <Route pts={[[36.3, 36.85], [38.5, 36.4], [40.5, 35.9]]} frame={frame} from={1428} to={1560} z={z} color={RED} />
          <Route
            pts={[[36.2, 36.8], [35.9, 35.5], [35.2, 33.3], [34.4, 31.5], [32.5, 31.0], [31.3, 29.9], [29.9, 31.2]]}
            frame={frame}
            from={1575}
            to={1880}
            z={z}
          />
          <Route
            pts={[[35.2, 33.3], [36.2, 34.8], [38.0, 35.9], [40.2, 36.6], [42.2, 36.8], [43.3, 36.4]]}
            frame={frame}
            from={2600}
            to={2900}
            z={z}
          />

          <Pulse at={gauga} frame={frame} z={z} />
          <Pin at={gauga} label="GAUGAMELA" s={pop(frame, 20, 24)} z={z} />
          <Pin at={[22.5, 40.8]} label="MAKEDONIA" s={pop(frame, 160, 22)} z={z} />
          <Pin
            at={[26.35, 40.2]}
            label="HELLESPONT"
            s={pop(frame, 604, 22)}
            z={z}
            o={1 - prog(frame, 740, 780)}
          />
          <Pin at={granicus} label="GRANICUS" s={pop(frame, 890, 22)} z={z} />
          <Pin at={issus} label="ISSUS" s={pop(frame, 991, 22)} z={z} />
          <Pin at={[35.2, 33.3]} label="TIRUS" s={pop(frame, 1662, 22)} z={z} />
          <Pin at={[29.9, 31.2]} label="ALEXANDRIA" s={pop(frame, 1840, 22)} z={z} />
          <Pin at={[38.0, 35.9]} label="EFRAT" s={pop(frame, 2735, 22)} z={z} />
          <Pin at={[42.2, 36.8]} label="TIGRIS" s={pop(frame, 2850, 22)} z={z} />

          {/* Pasukan Persia berkumpul di dataran */}
          <g transform={`translate(${gp[0]} ${gp[1]}) scale(${clusterS / z})`}>
            <Dots cx={0} cy={50} rows={clusterRows} cols={12} gap={22} r={9} fill={RED} />
          </g>
        </g>

        {showA ? (
          <Callout
            id="b2-callout-a"
            c={[440, 430]}
            tip={[gScreen[0], gScreen[1] - 40]}
            r={190}
            s={pop(frame, 900, 22)}
            o={1 - prog(frame, 985, 1015)}
          >
            <GranicusArt t={frame - 900} />
          </Callout>
        ) : null}

        {showB ? (
          <Callout
            id="b2-callout-b"
            c={[440, 430]}
            tip={[iScreen[0], iScreen[1] - 40]}
            r={190}
            s={pop(frame, 1170, 22)}
            o={1 - prog(frame, 1545, 1575)}
          >
            <IssusArt t={frame - 1170} />
          </Callout>
        ) : null}

        <rect width={1920} height={1080} fill="url(#b2-vig)" />
        <Timeline frame={frame} />
        <TopCaption frame={frame} />
        <text x={24} y={1062} fontSize={20} fill={CREAM} fillOpacity={0.6} fontFamily={FONT_SERIF}>
          Peta disederhanakan, tidak berskala
        </text>
      </svg>
    </AbsoluteFill>
  );
};