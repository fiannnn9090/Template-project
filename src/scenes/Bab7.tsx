import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { BLUE, CREAM, Dots, FONT_SERIF, FONT_STENCIL, GOLD, INK, RED, Tag, pop, prog } from "./common";
import { MapBase, Pin, Route } from "./Bab2";
import { AlexanderBust } from "./Alexander";
import { SUBS } from "../subtitles";

const S = SUBS[6].map(([f]) => f);

const Card: React.FC<{ id: string; cx: number; at: number; label: string; frame: number; children: React.ReactNode }> = ({
  id,
  cx,
  at,
  label,
  frame,
  children,
}) => {
  if (frame < at) return null;
  return (
    <g transform={`translate(${cx} 520) scale(${pop(frame, at, 22)})`}>
      <circle r={190} fill={CREAM} />
      <clipPath id={id}>
        <circle r={170} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-170} y={-170} width={340} height={340} fill="#d9bd8f" />
        {children}
      </g>
      <text y={250} textAnchor="middle" fontSize={34} letterSpacing={2} fill={CREAM} fontFamily={FONT_STENCIL}>
        {label}
      </text>
    </g>
  );
};

export const Bab7Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const tint = interpolateColors(frame, [S[4], S[4] + 60], [RED, BLUE]);
  const d = S[4] - S[3];
  const lo = prog(frame, S[5], S[5] + 25);
  const cardsO = 1 - prog(frame, S[10], S[10] + 20);
  const closeO = prog(frame, S[11], S[11] + 25);
  const gap = S[11] - S[10];

  return (
    <AbsoluteFill style={{ opacity: prog(frame, 0, 20) }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <marker id="b7-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={INK} />
          </marker>
        </defs>

        {/* Peta: wilayah Persia berubah warna */}
        <g transform="translate(960 540) scale(2) translate(-1493 -642)">
          <MapBase empire={prog(frame, 0, 30)} tint={tint} />
          <Route pts={[[43.3, 36.4], [48.5, 34.8], [53.5, 36.2]]} frame={frame} from={S[1] + 20} to={S[2]} z={2} color={RED} />
          <Route pts={[[43.3, 36.4], [44.4, 32.5], [48.2, 32.2], [52.9, 29.9]]} frame={frame} from={S[3]} to={S[4]} z={2} />
          <Pin at={[43.3, 36.4]} label="GAUGAMELA" s={pop(frame, 10, 24)} z={2} />
          <Pin at={[53.5, 36.2]} label="BESSUS" s={pop(frame, S[2] + 40, 22)} z={2} />
          <Pin at={[44.4, 32.5]} label="BABILONIA" s={pop(frame, S[3] + d * 0.33, 22)} z={2} />
          <Pin at={[48.2, 32.2]} label="SUSA" s={pop(frame, S[3] + d * 0.61, 22)} z={2} />
          <Pin at={[52.9, 29.9]} label="PERSEPOLIS" s={pop(frame, S[3] + d * 0.95, 22)} z={2} />
        </g>

        <Tag x={960} y={200} text="GAUGAMELA MENGUBAH SEJARAH" s={pop(frame, 10)} o={1 - prog(frame, S[1], S[1] + 20)} />
        {["PASUKAN", "WIBAWA", "DUKUNGAN"].map((t, i) => (
          <Tag key={t} x={300} y={300 + i * 80} text={t} s={pop(frame, S[1] + 60 + i * 30)} o={1 - prog(frame, S[2], S[2] + 20)} />
        ))}
        <Tag x={960} y={200} text="DINASTI AKHEMENIYAH BERAKHIR" s={pop(frame, S[4])} o={1 - lo} />

        {/* Pelajaran */}
        <rect width={1920} height={1080} fill="#1d2838" opacity={lo} />
        <g opacity={cardsO}>
          <g transform={`translate(960 190) scale(${pop(frame, S[5])})`}>
            <text textAnchor="middle" fontSize={96} fill={GOLD} fontFamily={FONT_STENCIL}>PELAJARAN</text>
          </g>
          <Card id="b7-c1" cx={480} at={S[6]} label="JUMLAH BUKAN SEGALANYA" frame={frame}>
            <g opacity={0.5}>
              <Dots cx={0} cy={-80} rows={3} cols={9} gap={22} fill={RED} />
            </g>
            <Dots cx={0} cy={80} rows={2} cols={5} gap={22} fill={BLUE} />
          </Card>
          <Card id="b7-c2" cx={960} at={S[8]} label="PERSIAPAN MATANG" frame={frame}>
            <rect x={-120} y={-90} width={240} height={180} rx={14} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="14 10" />
            <Dots cx={0} cy={0} rows={4} cols={9} gap={22} fill={BLUE} />
          </Card>
          <Card id="b7-c3" cx={1440} at={S[9]} label="BERANI MENGAMBIL MOMEN" frame={frame}>
            <Dots cx={-85} cy={-60} rows={3} cols={4} gap={18} fill={RED} />
            <Dots cx={85} cy={-60} rows={3} cols={4} gap={18} fill={RED} />
            <line x1={0} y1={140} x2={0} y2={-90} stroke={INK} strokeWidth={9} strokeLinecap="round" markerEnd="url(#b7-head)" />
          </Card>
        </g>

        {/* Potret Alexander */}
        {frame >= S[10] ? (
          <g opacity={1 - closeO}>
            <g transform={`translate(960 500) scale(${pop(frame, S[10] + 10, 24)})`}>
              <circle r={250} fill={CREAM} />
              <clipPath id="b7-por">
                <circle r={228} />
              </clipPath>
              <g clipPath="url(#b7-por)">
                <rect x={-230} y={-230} width={460} height={460} fill="#d9bd8f" />
                <AlexanderBust x={0} y={20} s={1.05} frame={frame} />
              </g>
            </g>
            <Tag x={400} y={500} text="RENCANA MATANG" s={pop(frame, S[10] + gap * 0.5)} />
            <Tag x={1520} y={500} text="KETENANGAN" s={pop(frame, S[10] + gap * 0.78)} />
          </g>
        ) : null}

        {/* Penutup */}
        <g opacity={closeO}>
          <rect width={1920} height={1080} fill="#1d2838" />
          <g transform={`translate(960 430) scale(${pop(frame, S[11] + 10, 24)})`}>
            <text textAnchor="middle" fontSize={110} fill={CREAM} fontFamily={FONT_STENCIL}>TAKTIK ALEXANDER AGUNG</text>
          </g>
          <g transform={`translate(960 540) scale(${pop(frame, S[11] + 30, 24)})`}>
            <text textAnchor="middle" fontSize={64} letterSpacing={4} fill={GOLD} fontFamily={FONT_STENCIL}>DI GAUGAMELA</text>
          </g>
          {frame >= S[12] ? (
            <g transform={`translate(960 700) scale(${pop(frame, S[12])})`}>
              <text textAnchor="middle" fontSize={54} fill={CREAM} fontFamily={FONT_STENCIL}>PERTEMPURAN MANA BERIKUTNYA?</text>
              <text y={66} textAnchor="middle" fontSize={40} fontStyle="italic" fill={CREAM} fontFamily={FONT_SERIF}>tulis di kolom komentar</text>
            </g>
          ) : null}
          {frame >= S[13] ? (
            <g transform={`translate(960 880) scale(${pop(frame, S[13])})`}>
              <text textAnchor="middle" fontSize={70} fill={GOLD} fontFamily={FONT_STENCIL}>SAMPAI JUMPA</text>
            </g>
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
};