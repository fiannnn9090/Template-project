import React from "react";
import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CHAPTERS, INTRO, OUTRO, sceneFrames } from "./timing";
import { Bab5Battle } from "./battle/Battle";
import { Bab1Scene } from "./scenes/Bab1";
import { Bab2Scene } from "./scenes/Bab2";
import { Bab3Scene } from "./scenes/Bab3";
import { Subtitle } from "./Subtitle";
import { Bab4Scene } from "./scenes/Bab4";
import { Bab6Scene } from "./scenes/Bab6";
import { Bab7Scene } from "./scenes/Bab7";
import { OutroScene } from "./scenes/IntroOutro";
import { IntroScene } from "./scenes/Intro";
import { Soundtrack } from "./Sfx";

const Title: React.FC<{ line1: string; line2?: string }> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: "#0b0d12",
        justifyContent: "center",
        alignItems: "center",
        color: "#f2e9d8",
        fontFamily: "Georgia, serif",
        textAlign: "center",
      }}
    >
      <div style={{ opacity }}>
        <div style={{ fontSize: 96 }}>{line1}</div>
        {line2 ? (
          <div style={{ fontSize: 40, marginTop: 24, opacity: 0.7 }}>{line2}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const Chapter: React.FC<{ index: number; title: string; audio: string }> = ({
  index,
  title,
  audio,
}) => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile(audio)} />
      {index === 0 ? (
    <Bab1Scene />
      ) : index === 1 ? (
    <Bab2Scene />
      ) : index === 2 ? (
    <Bab3Scene />
      ) : index === 3 ? (
    <Bab4Scene />
      ) : index === 5 ? (
    <Bab6Scene />
      ) : index === 6 ? (
    <Bab7Scene />
      ) : index === 4 ? (
    <Bab5Battle />
      ) : (
        <Title line1={`Bab ${index + 1}`} line2={title} />
      )}
      <Subtitle chapter={index} />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
     return (
      <AbsoluteFill>
        <Soundtrack />
         <Series>
      <Series.Sequence durationInFrames={INTRO}>
        <IntroScene />
      </Series.Sequence>
      {CHAPTERS.map((c, i) => (
        <Series.Sequence key={c.id} durationInFrames={sceneFrames(i)}>
          <Chapter index={i} title={c.title} audio={c.audio} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={OUTRO}>
        <OutroScene />
      </Series.Sequence>
          </Series>
       </AbsoluteFill>
     );
};