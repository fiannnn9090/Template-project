import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { CHAPTERS, INTRO, OUTRO, TOTAL_FRAMES, sceneFrames } from "./timing";
import { SUBS } from "./subtitles";

const LOOP = 1800; // music.mp3 berdurasi 60 detik = 1800 frame
const OUT0 = TOTAL_FRAMES - OUTRO;
const at = (i: number) => INTRO + CHAPTERS.slice(0, i).reduce((a, _, j) => a + sceneFrames(j), 0);
const sub = (c: number, k: number) => at(c) + SUBS[c][k][0];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Musik keras di intro/outro (tanpa narasi), pelan saat narasi.
const vol = (f: number) =>
  interpolate(f, [0, INTRO - 30, INTRO + 30, OUT0 - 30, OUT0 + 30], [0.4, 0.4, 0.12, 0.12, 0.4], clamp) *
  interpolate(f, [0, 30, TOTAL_FRAMES - 60, TOTAL_FRAMES], [0, 1, 1, 0], clamp);

// [frame global, nama file di public/audio, volume (opsional)]
const EVENTS: [number, string, number?][] = [
  [120, "whoosh", 0.6],
  [150, "drum"],
  ...CHAPTERS.map((_, i): [number, string, number?] => [at(i), "whoosh", 0.5]),
  [at(0) + 1200, "drum"], // "RENCANA" muncul di Bab 1
  [at(4) + 2026, "clash"], // serangan baji
  [at(4) + 2767, "drum"], // Darius melarikan diri
  [sub(5, 5), "clash", 0.7], // penerobosan ke kamp
  [sub(5, 10), "page"], // buku terbuka
  [sub(6, 4), "drum"], // dinasti berakhir
  [OUT0 + 210, "pop"],
  [OUT0 + 235, "pop"],
  [OUT0 + 260, "pop"],
];

export const Soundtrack: React.FC = () => (
  <>
    {Array.from({ length: Math.ceil(TOTAL_FRAMES / LOOP) }, (_, i) => (
      <Sequence key={`m${i}`} from={i * LOOP} durationInFrames={LOOP} layout="none">
        <Audio src={staticFile("audio/music.mp3")} volume={(f) => vol(i * LOOP + f)} />
      </Sequence>
    ))}
    {EVENTS.map(([f, name, v], i) => (
      <Sequence key={`s${i}`} from={f} durationInFrames={120} layout="none">
        <Audio src={staticFile(`audio/${name}.mp3`)} volume={v ?? 0.8} />
      </Sequence>
    ))}
  </>
);