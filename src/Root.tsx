import React from "react";
import { Composition, Still } from "remotion";
import { Video } from "./Video";
import { Thumbnail } from "./scenes/Thumbnail";
import { FPS, TOTAL_FRAMES } from "./timing";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Gaugamela" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
  </>
);