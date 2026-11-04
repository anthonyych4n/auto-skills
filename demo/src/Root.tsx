import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Fade } from "./components";
import { Demo } from "./scenes/Demo";
import { Outro } from "./scenes/Outro";
import { Problem } from "./scenes/Problem";
import { Sound } from "./Sound";
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
// Royalty-free track in public/music/, or undefined for effects only.
const MUSIC: string | undefined = "music/lofi-hip-hop.mp3";

type Props = { sound?: boolean; music?: string };

export const Launch: React.FC<Props> = ({ sound, music }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {sound ? <Sound music={music} /> : null}
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
    {/* With sound effects (+ music when MUSIC is set). Silent cuts above stay clean for in-app trending audio. */}
    <Composition id="Launch16x9Sound" component={Launch} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{ sound: true, music: MUSIC }} />
    <Composition id="Launch9x16Sound" component={Launch} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{ sound: true, music: MUSIC }} />
  </>
);
