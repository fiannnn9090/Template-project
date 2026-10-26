import React from "react";

const L = "#3a2312";

const Peak: React.FC<{ x: number; h: number; w: number }> = ({ x, h, w }) => (
  <g transform={`translate(${x} 170)`}>
    <path d={`M${-w},0 L0,${-h} L0,0 Z`} fill="#a98066" />
    <path d={`M0,0 L0,${-h} L${w},0 Z`} fill="#7a5a56" />
    <path d={`M${-w},0 L0,${-h} L${w},0`} fill="none" stroke={L} strokeWidth={5} strokeLinejoin="round" />
    <path d={`M0,${-h} L${-w * 0.25},${-h * 0.45}`} fill="none" stroke={L} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
  </g>
);

const Rock: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={22} rx={42} ry={9} fill="#000" opacity={0.18} />
    <path d="M-34,16 Q-40,-14 -10,-26 Q22,-36 36,-8 Q46,14 28,20 Z" fill="#8f7b6b" stroke={L} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-16,-10 Q4,-24 20,-14" fill="none" stroke="#b5a08c" strokeWidth={5} strokeLinecap="round" />
  </g>
);

const BUSH: [number, number, number][] = [[-16, 4, 18], [14, 2, 20], [0, -10, 22]];

const Shrub: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={18} rx={34} ry={7} fill="#000" opacity={0.15} />
    <g fill="#7a8a42" stroke={L} strokeWidth={8}>
      {BUSH.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} />
      ))}
    </g>
    <g fill="#7a8a42">
      {BUSH.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} />
      ))}
    </g>
    <circle cx={-6} cy={-14} r={7} fill="#97a85a" />
  </g>
);

const Tent: React.FC<{ x: number; y: number; flag: string; frame: number; s?: number }> = ({
  x,
  y,
  flag,
  frame,
  s = 1,
}) => {
  const w = Math.sin(frame / 8 + x) * 5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={32} rx={58} ry={9} fill="#000" opacity={0.18} />
      <path d="M-50,30 L0,-46 L50,30 Z" fill="#e9dcc0" />
      <path d="M0,-46 L50,30 L22,30 Z" fill="#cdbb98" />
      <path d="M-50,30 L0,-46 L50,30 Z" fill="none" stroke={L} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-12,30 L0,0 L12,30 Z" fill="#5a3b24" />
      <line x1={0} y1={-46} x2={0} y2={-82} stroke={L} strokeWidth={4} />
      <path d={`M0,-82 Q${14 + w},-84 ${28 + w},-72 L0,-62 Z`} fill={flag} stroke={L} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
};

const Fire: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const f = 1 + Math.sin(frame / 3 + x) * 0.12;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={8} rx={20} ry={6} fill="#000" opacity={0.2} />
      <path d="M-14,8 L14,0 M-14,0 L14,8" stroke="#4a3426" strokeWidth={6} strokeLinecap="round" />
      <path d={`M0,${-30 * f} Q16,-8 10,4 Q0,10 -10,4 Q-16,-8 0,${-30 * f} Z`} fill="#f08a2c" stroke={L} strokeWidth={3} strokeLinejoin="round" />
      <path d="M0,-14 Q8,-4 4,2 Q-4,2 -4,-4 Z" fill="#ffd36b" />
      {[0, 1, 2].map((i) => {
        const t = ((frame * 0.8 + i * 30) % 90) / 90;
        return (
          <circle key={i} cx={Math.sin(t * 6 + i) * 8} cy={-30 - t * 70} r={6 + t * 10} fill="#d9d2c4" opacity={0.5 * (1 - t)} />
        );
      })}
    </g>
  );
};

const LEFT: [number, number, number][] = [[70, 90, 140], [230, 130, 170], [400, 170, 200], [570, 110, 160], [700, 140, 150]];
const RIGHT: [number, number, number][] = [[1200, 120, 160], [1360, 150, 190], [1540, 170, 210], [1710, 120, 170], [1850, 150, 160]];
const DIRT: [number, number, number, number][] = [[300, 560, 150, 40], [1520, 880, 170, 36], [1640, 540, 120, 30], [260, 780, 140, 30], [900, 430, 200, 40]];
const TUFTS: [number, number][] = [[420, 520], [560, 560], [1240, 880], [1380, 900], [200, 640], [1820, 620], [720, 880], [1560, 330], [330, 470], [1010, 900]];

export const Scenery: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <defs>
      <linearGradient id="sc-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8c6b66" />
        <stop offset="1" stopColor="#8c6b66" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Bercak tanah dan rumput */}
    {DIRT.map(([x, y, rx, ry], i) => (
      <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#b8935f" opacity={0.35} />
    ))}
    {TUFTS.map(([x, y], i) => (
      <path key={i} transform={`translate(${x} ${y})`} d="M0,0 L-6,-14 M0,0 L0,-18 M0,0 L6,-14" stroke="#6b7a3a" strokeWidth={3} strokeLinecap="round" fill="none" />
    ))}

    {/* Pegunungan di cakrawala */}
    <rect x={0} y={150} width={780} height={80} fill="url(#sc-fade)" />
    <rect x={1130} y={150} width={790} height={80} fill="url(#sc-fade)" />
    {LEFT.map(([x, h, w], i) => (
      <Peak key={`l${i}`} x={x} h={h} w={w} />
    ))}
    {RIGHT.map(([x, h, w], i) => (
      <Peak key={`r${i}`} x={x} h={h} w={w} />
    ))}

    {/* Batu dan semak */}
    <Rock x={120} y={440} />
    <Rock x={190} y={475} s={0.7} />
    <Rock x={80} y={700} s={0.9} />
    <Rock x={1790} y={760} s={1.1} />
    <Rock x={1855} y={805} s={0.8} />
    <Rock x={1740} y={300} s={0.9} />
    <Shrub x={1780} y={900} />
    <Shrub x={1860} y={870} s={0.8} />
    <Shrub x={70} y={560} s={0.9} />
    <Shrub x={1500} y={960} s={0.8} />

    {/* Kamp Persia (kiri atas) */}
    <Tent x={140} y={290} flag="#b3262b" frame={frame} />
    <Tent x={260} y={320} flag="#b3262b" frame={frame} s={0.9} />
    <Tent x={190} y={380} flag="#b3262b" frame={frame} s={0.8} />
    <Fire x={60} y={360} frame={frame} />

    {/* Kamp Makedonia (kiri bawah) */}
    <Tent x={120} y={870} flag="#2c63c9" frame={frame} s={0.9} />
    <Tent x={240} y={900} flag="#2c63c9" frame={frame} />
    <Tent x={170} y={820} flag="#2c63c9" frame={frame} s={0.8} />
    <Fire x={320} y={910} frame={frame} />
  </g>
);

// Gunung di cakrawala; y = garis dasar gunung, xs = posisi tiap gunung.
export const Peaks: React.FC<{ y: number; xs: number[] }> = ({ y, xs }) => (
  <g transform={`translate(0 ${y - 170})`}>
    {xs.map((x, i) => (
      <Peak key={i} x={x} h={90 + ((i * 37) % 70)} w={150 + ((i * 53) % 60)} />
    ))}
  </g>
);

// Batu, semak, dan bercak tanah secara bergantian di titik-titik yang diberikan.
export const Ground: React.FC<{ pts: [number, number][] }> = ({ pts }) => (
  <g>
    {pts.map(([x, y], i) =>
      i % 3 === 0 ? (
        <Rock key={i} x={x} y={y} s={0.7 + (i % 4) * 0.12} />
      ) : i % 3 === 1 ? (
        <Shrub key={i} x={x} y={y} s={0.7 + (i % 3) * 0.12} />
      ) : (
        <ellipse key={i} cx={x} cy={y} rx={110} ry={26} fill="#b8935f" opacity={0.35} />
      )
    )}
  </g>
);

// Perkemahan: tiga tenda dan satu api unggun.
export const Camp: React.FC<{ x: number; y: number; flag: string; frame: number; s?: number }> = ({
  x,
  y,
  flag,
  frame,
  s = 1,
}) => (
  <g>
    <Tent x={x} y={y} flag={flag} frame={frame} s={s} />
    <Tent x={x + 130 * s} y={y - 12 * s} flag={flag} frame={frame} s={s * 0.9} />
    <Tent x={x + 250 * s} y={y} flag={flag} frame={frame} s={s * 0.85} />
    <Fire x={x + 120 * s} y={y + 40 * s} frame={frame} />
  </g>
);