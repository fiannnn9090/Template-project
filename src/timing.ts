export const FPS = 30;
export const GAP = 1 * FPS; // jeda 1 detik antar bab
export const INTRO = 8 * FPS;
export const OUTRO = 15 * FPS;

// frames = ceil(durasi audio dalam detik x 30)
export const CHAPTERS = [
  { id: "bab1", title: "Hook", audio: "audio/bab1.mp3", frames: 1893 },
  { id: "bab2", title: "Latar belakang", audio: "audio/bab2.mp3", frames: 2989 },
  { id: "bab3", title: "Medan dan kekuatan", audio: "audio/bab3.mp3", frames: 2838 },
  { id: "bab4", title: "Formasi dan rencana", audio: "audio/bab4.mp3", frames: 2797 },
  { id: "bab5", title: "Jalannya pertempuran", audio: "audio/bab5.mp3", frames: 3422 },
  { id: "bab6", title: "Sayap kiri dan perbedaan sumber", audio: "audio/bab6.mp3", frames: 1936 },
  { id: "bab7", title: "Dampak dan penutup", audio: "audio/bab7.mp3", frames: 1876 },
];

// Durasi scene = durasi audio + jeda (kecuali bab terakhir)
export const sceneFrames = (i: number) =>
  CHAPTERS[i].frames + (i < CHAPTERS.length - 1 ? GAP : 0);

export const TOTAL_FRAMES =
  INTRO +
  CHAPTERS.reduce((sum, _, i) => sum + sceneFrames(i), 0) +
  OUTRO;