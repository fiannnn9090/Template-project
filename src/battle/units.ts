export type Side = "mak" | "per";
export type KF = { f: number; x: number; y: number; o?: number };

export type Formation = {
  id: string;
  side: Side;
  kind: "inf" | "cav" | "chariot";
  rows: number;
  cols: number;
  gap: number;
  banner?: string;
  bannerBelow?: boolean;
  kfs: KF[];
};

export type Commander = {
  id: string;
  name: string;
  subtitle?: string;
  side: Side;
  kfs: KF[];
};

// Semua titik waktu (frame, relatif terhadap awal Bab 5) ada di sini.
// Nilainya perkiraan dari proporsi kata narasi; sesuaikan setelah mendengar suaranya.
export const PHASE = {
  fadeIn: 90, // semua unit muncul
  oblique: 205, // Alexander mulai bergeser serong ke kanan
  persianShift: 764, // kavaleri Persia ikut bergeser
  chariots: 1396, // kereta perang dilepaskan
  wedge: 2026, // Companion menyerbu celah
  pressure: 2524, // tekanan langsung ke arah Darius
  flee: 2767, // Darius melarikan diri
  collapse: 3167, // pusat Persia runtuh
  end: 3422, // akhir audio Bab 5
} as const;

const P = PHASE;

export const CAPTIONS = [
  { from: 0, text: "Persia (merah) melawan Makedonia (biru)" },
  { from: P.oblique, text: "Alexander bergeser serong ke kanan" },
  { from: P.persianShift, text: "Kavaleri Persia ikut bergeser, barisan meregang" },
  { from: P.chariots, text: "Kereta perang dilepaskan, dihentikan pasukan ringan" },
  { from: P.wedge, text: "Companion menyerbu celah menuju Darius" },
  { from: P.pressure, text: "Satu pasukan kecil menusuk ke arah sang raja" },
  { from: P.flee, text: "Darius melarikan diri" },
  { from: P.collapse, text: "Pusat Persia runtuh" },
];

// Kartu gulungan: muncul sedikit sebelum gerakan yang dijelaskan.
export const CARDS = [
  {
    from: P.oblique - 90,
    dur: 170,
    title: "GERAKAN SERONG",
    sub: "Alexander menggeser pasukannya ke kanan",
  },
  {
    from: P.wedge - 60,
    dur: 170,
    title: "SERANGAN BAJI",
    sub: "Companion menusuk celah menuju Darius",
  },
];

const shift = (kfs: KF[], dx: number, dy: number): KF[] =>
  kfs.map((k) => ({ ...k, x: k.x + dx, y: k.y + dy }));

const companionKfs: KF[] = [
  { f: 0, x: 1330, y: 790, o: 0 },
  { f: P.fadeIn, x: 1330, y: 790, o: 1 },
  { f: P.oblique, x: 1330, y: 790 },
  { f: P.persianShift, x: 1520, y: 710 },
  { f: P.chariots, x: 1560, y: 690 },
  { f: P.wedge, x: 1560, y: 690 },
  { f: P.pressure, x: 1320, y: 410 },
  { f: P.flee, x: 1050, y: 330 },
  { f: P.collapse, x: 1010, y: 320 },
  { f: P.end, x: 1010, y: 320 },
];

// Urutan array = urutan gambar (yang belakangan tampil di atas).
export const FORMATIONS: Formation[] = [
  // --- Persia ---
  {
    id: "per-pusat",
    side: "per",
    kind: "inf",
    rows: 5,
    cols: 14,
    gap: 22,
    banner: "Pusat Persia",
    kfs: [
      { f: 0, x: 960, y: 330, o: 0 },
      { f: P.fadeIn, x: 960, y: 330, o: 1 },
      { f: P.flee, x: 960, y: 330, o: 1 },
      { f: P.end, x: 960, y: 330, o: 0.3 },
    ],
  },
  {
    id: "per-kanan",
    side: "per",
    kind: "cav",
    rows: 3,
    cols: 9,
    gap: 26,
    banner: "Sayap kanan Persia",
    kfs: [
      { f: 0, x: 480, y: 380, o: 0 },
      { f: P.fadeIn, x: 480, y: 380, o: 1 },
      { f: P.pressure, x: 480, y: 380, o: 1 },
      { f: P.end, x: 480, y: 510, o: 1 },
    ],
  },
  {
    id: "per-kiri",
    side: "per",
    kind: "cav",
    rows: 3,
    cols: 9,
    gap: 26,
    banner: "Sayap kiri Persia",
    kfs: [
      { f: 0, x: 1450, y: 380, o: 0 },
      { f: P.fadeIn, x: 1450, y: 380, o: 1 },
      { f: P.persianShift - 64, x: 1450, y: 380 },
      { f: P.chariots - 96, x: 1680, y: 510 },
      { f: P.chariots, x: 1680, y: 550 },
      { f: P.end, x: 1680, y: 550 },
    ],
  },
  {
    id: "kereta",
    side: "per",
    kind: "chariot",
    rows: 1,
    cols: 5,
    gap: 100,
    banner: "Kereta perang",
    kfs: [
      { f: 0, x: 960, y: 450, o: 0 },
      { f: P.chariots - 30, x: 960, y: 450, o: 0 },
      { f: P.chariots, x: 960, y: 450, o: 1 },
      { f: P.chariots + 200, x: 960, y: 710, o: 1 },
      { f: P.chariots + 300, x: 960, y: 760, o: 0 },
    ],
  },
  // --- Makedonia ---
  {
    id: "mak-thessalia",
    side: "mak",
    kind: "cav",
    rows: 2,
    cols: 7,
    gap: 26,
    banner: "Kavaleri Thessalia",
    kfs: [
      { f: 0, x: 480, y: 810, o: 0 },
      { f: P.fadeIn, x: 480, y: 810, o: 1 },
      { f: P.end, x: 480, y: 810, o: 1 },
    ],
  },
  {
    id: "mak-cadangan",
    side: "mak",
    kind: "inf",
    rows: 2,
    cols: 18,
    gap: 20,
    banner: "Lapis kedua",
    bannerBelow: true,
    kfs: [
      { f: 0, x: 900, y: 900, o: 0 },
      { f: P.fadeIn, x: 900, y: 900, o: 1 },
      { f: P.persianShift, x: 960, y: 865 },
      { f: P.wedge, x: 980, y: 835 },
      { f: P.collapse, x: 1000, y: 755 },
      { f: P.end, x: 1000, y: 755 },
    ],
  },
  {
    id: "mak-phalanx",
    side: "mak",
    kind: "inf",
    rows: 4,
    cols: 20,
    gap: 18,
    banner: "Phalanx",
    kfs: [
      { f: 0, x: 900, y: 830, o: 0 },
      { f: P.fadeIn, x: 900, y: 830, o: 1 },
      { f: P.persianShift, x: 960, y: 790 },
      { f: P.wedge, x: 980, y: 760 },
      { f: P.pressure, x: 1000, y: 670 },
      { f: P.flee, x: 1000, y: 590 },
      { f: P.collapse, x: 1000, y: 500 },
      { f: P.end, x: 1000, y: 500 },
    ],
  },
  {
    id: "mak-ringan",
    side: "mak",
    kind: "inf",
    rows: 2,
    cols: 6,
    gap: 18,
    banner: "Pasukan ringan",
    kfs: [
      { f: 0, x: 1130, y: 700, o: 0 },
      { f: P.fadeIn, x: 1130, y: 700, o: 1 },
      { f: P.persianShift, x: 1230, y: 690 },
      { f: P.end, x: 1230, y: 690 },
    ],
  },
  {
    id: "mak-companion",
    side: "mak",
    kind: "cav",
    rows: 2,
    cols: 8,
    gap: 26,
    kfs: companionKfs,
  },
];

export const COMMANDERS: Commander[] = [
  {
    id: "darius",
    name: "DARIUS III",
    side: "per",
    kfs: [
      { f: 0, x: 960, y: 150, o: 0 },
      { f: P.fadeIn, x: 960, y: 150, o: 1 },
      { f: P.flee, x: 960, y: 150, o: 1 },
      { f: P.collapse, x: 780, y: -130, o: 1 },
      { f: P.end, x: 780, y: -130, o: 1 },
    ],
  },
  {
    id: "alexander",
    name: "ALEXANDER",
    subtitle: "Companion",
    side: "mak",
    kfs: shift(companionKfs, 0, -105),
  },
];