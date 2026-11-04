import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { ALL_SKILLS } from "./theme";

// Global frame positions, derived from the scene timings in Root.tsx and the scenes.
const DEMO = 258; // demo scene start (270 - cross-fade)
const OUTRO = 738; // outro scene start (750 - cross-fade)
const TYPE_SPEED = 1.4; // frames per character, matches <Typed>

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 1 }) => (
  <Sequence from={Math.round(at)} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const typing = (start: number, text: string) =>
  Array.from({ length: Math.ceil(text.length / 2) }, (_, i) => ({ at: start + i * 2 * TYPE_SPEED, k: i % 5 }));

// The track's beat comes in at 10.0s; start it 1.4s in so the beat drops as the demo scene
// (and `auto-skills on`) arrives at 8.6s.
const MUSIC_OFFSET = Math.round(1.4 * 30);

export const Sound: React.FC<{ music?: string }> = ({ music }) => {
  const keys = [
    ...typing(DEMO + 14, "auto-skills on"),
    ...typing(DEMO + 86, "cd launch-video && claude"),
    ...typing(DEMO + 288, "cd ../my-app && claude"),
  ];
  const pilePops = ALL_SKILLS.map((_, i) => 20 + i * 4).filter((_, i) => i % 2 === 0);
  const skillPops = [0, 1, 2, 3].flatMap((i) => [DEMO + 160 + i * 6, DEMO + 356 + i * 6]);

  return (
    <>
      {music ? (
        <Audio
          src={staticFile(music)}
          trimBefore={MUSIC_OFFSET}
          volume={(f) => interpolate(f, [0, 15, 840, 900], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      ) : null}
      {pilePops.map((at, i) => <Sfx key={`pp${i}`} at={at} src="pop" volume={0.18 + (i / pilePops.length) * 0.2} />)}
      <Sfx at={196} src="thud" volume={0.5} />
      <Sfx at={DEMO - 6} src="whoosh" volume={0.35} />
      {keys.map(({ at, k }, i) => <Sfx key={`k${i}`} at={at} src={`key${k}`} volume={0.32} />)}
      {skillPops.map((at, i) => <Sfx key={`sp${i}`} at={at} src="pop" volume={0.45} />)}
      <Sfx at={DEMO + 340} src="whoosh" volume={0.4} />
      <Sfx at={OUTRO - 6} src="whoosh" volume={0.3} />
      {[0, 12, 24].map((d) => <Sfx key={`t${d}`} at={OUTRO + d} src="thud" volume={0.55} />)}
      <Sfx at={OUTRO + 30} src="chime" volume={0.4} />
    </>
  );
};
