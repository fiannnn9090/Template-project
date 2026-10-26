import React from "react";

const LINE = "#3a2312";
const SKIN = "#e8b583";
const SKIN_D = "#d49a68";
const HAIR = "#a8683a";
const HAIR_L = "#c98a52";
const GOLD = "#e0a93a";
const GOLD_D = "#b9822a";
const ARMOR = "#cf9a38";
const ARMOR_D = "#9a6a1f";
const CLOAK = "#a8493a";
const CLOAK_D = "#7e3328";

type Curl = [number, number, number]; // [x, y, jari-jari]

const BACK_HAIR: Curl[] = [
  [-98, -6, 32], [-104, -46, 36], [-84, -88, 38], [-46, -114, 38], [0, -122, 40],
  [46, -114, 38], [84, -88, 38], [104, -46, 36], [98, -6, 30], [-92, 30, 26], [94, 28, 24],
];
const FRONT_HAIR: Curl[] = [
  [-58, -74, 26], [-22, -88, 26], [20, -90, 26], [58, -76, 24],
];

// Ikal rambut: digambar dua kali agar hanya kontur luarnya yang bergaris.
const Curls: React.FC<{ c: Curl[]; fill: string }> = ({ c, fill }) => (
  <g>
    <g fill={fill} stroke={LINE} strokeWidth={14} strokeLinejoin="round">
      {c.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
    <g fill={fill}>
      {c.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
  </g>
);

// Daun mahkota disusun di sepanjang elips; rotasi mengikuti arah singgung.
const LEAVES = Array.from({ length: 11 }, (_, i) => {
  const phi = ((195 + (i / 10) * 150) * Math.PI) / 180;
  return {
    x: 86 * Math.cos(phi),
    y: -42 + 62 * Math.sin(phi),
    rot: (phi * 180) / Math.PI + 90 + 25,
  };
});

const Head: React.FC<{ blink: number }> = ({ blink }) => (
  <g>
    <Curls c={BACK_HAIR} fill={HAIR} />
    <g fill={HAIR_L} opacity={0.55}>
      <circle cx={-30} cy={-130} r={11} />
      <circle cx={34} cy={-128} r={11} />
      <circle cx={-84} cy={-92} r={10} />
      <circle cx={86} cy={-90} r={10} />
      <circle cx={-104} cy={-48} r={9} />
      <circle cx={104} cy={-46} r={9} />
    </g>

    {/* Telinga */}
    <ellipse cx={-80} cy={12} rx={13} ry={19} fill={SKIN} stroke={LINE} strokeWidth={6} />
    <ellipse cx={80} cy={12} rx={13} ry={19} fill={SKIN} stroke={LINE} strokeWidth={6} />

    {/* Wajah */}
    <path
      d="M-78,-40 C-80,20 -60,86 0,96 C60,86 82,20 78,-40 C60,-78 -60,-78 -78,-40 Z"
      fill={SKIN}
      stroke={LINE}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    <path
      d="M-78,-40 C-80,20 -60,86 0,96 C-40,70 -58,10 -54,-50 Z"
      fill={SKIN_D}
      opacity={0.5}
    />
    <ellipse cx={-52} cy={48} rx={14} ry={9} fill="#e39a76" opacity={0.5} />
    <ellipse cx={58} cy={48} rx={14} ry={9} fill="#e39a76" opacity={0.5} />

    {/* Mata (menoleh ke kanan) */}
    <g transform={`translate(0 10) scale(1 ${blink}) translate(0 -10)`}>
      <ellipse cx={-32} cy={10} rx={20} ry={24} fill="#ffffff" stroke={LINE} strokeWidth={5} />
      <ellipse cx={36} cy={10} rx={20} ry={24} fill="#ffffff" stroke={LINE} strokeWidth={5} />
      <ellipse cx={-24} cy={12} rx={11.5} ry={16} fill="#2a170c" />
      <ellipse cx={44} cy={12} rx={11.5} ry={16} fill="#2a170c" />
      <circle cx={-20} cy={5} r={4} fill="#ffffff" />
      <circle cx={48} cy={5} r={4} fill="#ffffff" />
    </g>

    {/* Alis, hidung, mulut */}
    <path d="M-58,-22 Q-34,-38 -10,-24" fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
    <path d="M16,-24 Q42,-38 66,-22" fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
    <path d="M4,22 Q14,42 -4,50" fill="none" stroke={LINE} strokeWidth={6} strokeLinecap="round" />
    <path d="M-22,66 Q4,80 32,64" fill="none" stroke={LINE} strokeWidth={6} strokeLinecap="round" />

    {/* Poni */}
    <Curls c={FRONT_HAIR} fill={HAIR} />

    {/* Mahkota daun */}
    <path d="M-83,-58 A86,62 0 0 1 83,-58" fill="none" stroke={GOLD_D} strokeWidth={8} strokeLinecap="round" />
    {LEAVES.map((l, i) => (
      <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
        <path d="M0,0 Q12,-9 26,0 Q12,9 0,0 Z" fill={GOLD} stroke={LINE} strokeWidth={4} strokeLinejoin="round" />
        <path d="M2,0 L22,0" stroke={GOLD_D} strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ))}
  </g>
);

const Neck: React.FC = () => (
  <g>
    <path d="M-32,70 L-32,132 Q0,150 32,132 L32,70 Z" fill={SKIN} stroke={LINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M-32,100 Q0,122 32,100 L32,132 Q0,150 -32,132 Z" fill={SKIN_D} opacity={0.55} />
  </g>
);

// Kerah tunik, selempang jubah, dan bros emas.
const Drape: React.FC = () => (
  <g>
    <path d="M-34,130 L0,160 L34,130 Q0,142 -34,130 Z" fill={CLOAK} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
    <path
      d="M34,128 C108,130 156,164 166,250 L102,250 C98,196 62,164 22,152 Z"
      fill={CLOAK}
      stroke={LINE}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M60,160 C92,176 108,206 112,250" fill="none" stroke={CLOAK_D} strokeWidth={6} strokeLinecap="round" />
  </g>
);

const Brooch: React.FC = () => (
  <g>
    <circle cx={-92} cy={150} r={19} fill={GOLD} stroke={LINE} strokeWidth={6} />
    <circle cx={-92} cy={150} r={9} fill="none" stroke={ARMOR_D} strokeWidth={5} />
  </g>
);

const BustBody: React.FC = () => (
  <g>
    <path
      d="M-160,250 C-172,150 -112,118 -40,118 L40,118 C112,118 172,150 160,250 Z"
      fill={CLOAK_D}
      stroke={LINE}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <Neck />
    <path
      d="M-80,142 C-40,126 40,126 80,142 L94,250 L-94,250 Z"
      fill={ARMOR}
      stroke={LINE}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M-44,172 Q-22,194 0,182 Q22,194 44,172" fill="none" stroke={ARMOR_D} strokeWidth={6} strokeLinecap="round" />
    <path d="M0,184 L0,246" stroke={ARMOR_D} strokeWidth={6} strokeLinecap="round" />
    <Drape />
    <Brooch />
  </g>
);

const FullBody: React.FC<{ sway: number }> = ({ sway }) => (
  <g>
    {/* Jubah belakang (bergoyang pelan) */}
    <g transform={`skewX(${sway})`}>
      <path
        d="M-160,140 C-190,300 -172,440 -142,506 L142,506 C172,440 190,300 160,140 Z"
        fill={CLOAK_D}
        stroke={LINE}
        strokeWidth={7}
        strokeLinejoin="round"
      />
    </g>

    {/* Kaki dan sandal */}
    <rect x={-52} y={400} width={38} height={160} rx={14} fill={SKIN} stroke={LINE} strokeWidth={6} />
    <rect x={14} y={400} width={38} height={160} rx={14} fill={SKIN} stroke={LINE} strokeWidth={6} />
    <ellipse cx={-33} cy={566} rx={32} ry={14} fill="#8a5a2a" stroke={LINE} strokeWidth={6} />
    <ellipse cx={33} cy={566} rx={32} ry={14} fill="#8a5a2a" stroke={LINE} strokeWidth={6} />

    <Neck />

    {/* Zirah dada */}
    <path
      d="M-80,142 C-40,126 40,126 80,142 L90,340 L-90,340 Z"
      fill={ARMOR}
      stroke={LINE}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M-44,172 Q-22,194 0,182 Q22,194 44,172" fill="none" stroke={ARMOR_D} strokeWidth={6} strokeLinecap="round" />
    <path d="M0,184 L0,316" stroke={ARMOR_D} strokeWidth={6} strokeLinecap="round" />
    <Drape />

    {/* Sabuk dan gesper */}
    <rect x={-96} y={320} width={192} height={30} rx={8} fill={GOLD_D} stroke={LINE} strokeWidth={6} />
    <circle cx={0} cy={335} r={24} fill={GOLD} stroke={LINE} strokeWidth={6} />
    <circle cx={0} cy={335} r={12} fill="none" stroke={ARMOR_D} strokeWidth={5} />

    {/* Rok zirah berlajur */}
    {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={i * 21 - 11} y={350} width={22} height={84} rx={9} fill="#d4a13f" stroke={LINE} strokeWidth={5} />
    ))}

    {/* Lengan kiri (kiri layar), terkulai */}
    <rect x={-136} y={152} width={46} height={92} rx={22} fill={CLOAK} stroke={LINE} strokeWidth={6} />
    <rect x={-132} y={236} width={38} height={88} rx={16} fill={SKIN} stroke={LINE} strokeWidth={6} />
    <rect x={-138} y={268} width={50} height={46} rx={10} fill={GOLD_D} stroke={LINE} strokeWidth={6} />
    <circle cx={-113} cy={334} r={22} fill={SKIN} stroke={LINE} strokeWidth={6} />

    {/* Lengan kanan, tangan di pinggang */}
    <path d="M92,162 L152,252 L98,326" fill="none" stroke={LINE} strokeWidth={58} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M92,162 L152,252 L98,326" fill="none" stroke={SKIN} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M92,162 L126,214" fill="none" stroke={CLOAK} strokeWidth={50} strokeLinecap="round" />
    <path d="M146,262 L118,304" fill="none" stroke={GOLD_D} strokeWidth={52} strokeLinecap="round" />
    <circle cx={98} cy={328} r={22} fill={SKIN} stroke={LINE} strokeWidth={6} />

    <Brooch />
  </g>
);

type Props = { x: number; y: number; s?: number; frame: number };

// Potret setengah badan (untuk callout).
export const AlexanderBust: React.FC<Props> = ({ x, y, s = 1, frame }) => {
  const bob = Math.sin(frame / 18) * 2.5;
  const blink = frame % 130 < 5 ? 0.1 : 1;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <BustBody />
      <Head blink={blink} />
    </g>
  );
};

// Sosok penuh. Titik (x, y) = pusat kepala; telapak kaki sekitar y + 580 * s.
export const AlexanderFull: React.FC<Props> = ({ x, y, s = 1, frame }) => {
  const bob = Math.sin(frame / 18) * 1.5;
  const sway = Math.sin(frame / 40) * 1.5;
  const blink = frame % 130 < 5 ? 0.1 : 1;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <FullBody sway={sway} />
      <Head blink={blink} />
    </g>
  );
};

// Wajah kecil untuk banner komandan.
export const AlexanderFace: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 0.28,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M-150,150 Q-140,112 -60,106 L60,106 Q140,112 150,150 Z"
      fill={CLOAK_D}
      stroke={LINE}
      strokeWidth={10}
      strokeLinejoin="round"
    />
    <path d="M-32,70 L-32,120 Q0,138 32,120 L32,70 Z" fill={SKIN} stroke={LINE} strokeWidth={9} strokeLinejoin="round" />
    <Head blink={1} />
  </g>
);