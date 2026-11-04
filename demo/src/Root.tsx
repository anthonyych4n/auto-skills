import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Fade } from "./components";
import { Demo } from "./scenes/Demo";
import { Outro } from "./scenes/Outro";
import { Problem } from "./scenes/Problem";
import { C } from "./theme";

const FPS = 30;
// Scenes overlap by XF frames and cross-fade.
const XF = 12;
const SCENES = [
  { id: "problem", from: 0, len: 270, C: Problem },
  { id: "demo", from: 270 - XF, len: 480 + XF, C: Demo },
  { id: "outro", from: 750 - XF, len: 150 + XF, C: Outro },
];
const TOTAL = 900;

export const Launch: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    {SCENES.map(({ id, from, len, C: Scene }, i) => (
      <Sequence key={id} from={from} durationInFrames={len} name={id}>
        <Fade inAt={0} len={i === 0 ? 1 : XF} outAt={i === SCENES.length - 1 ? undefined : len - XF}>
          <Scene />
        </Fade>
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Launch16x9" component={Launch} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="Launch9x16" component={Launch} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);
