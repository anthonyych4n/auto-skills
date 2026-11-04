import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Pill, Typed, useEnter, useLayout } from "../components";
import { ALL_SKILLS, C, MONO, SANS } from "../theme";

// Timeline (frames, local to this 480-frame scene)
const T = {
  on: 14,            // type `auto-skills on`
  onOut: 44,
  cdVid: 86,         // type `cd launch-video && claude`
  vidPick: 132,
  vidMatch: 150,
  vidPills: 160,
  cdApp: 288,        // type `cd ../my-app && claude`
  appPick: 330,
  appMatch: 346,
  appPills: 356,
};

const VIDEO_SKILLS = ["stageshow", "remotion-best-practices", "remotion-captions", "ui-ux-pro-max"];
const APP_SKILLS = ["ui-ux-pro-max", "ui-styling", "make-interfaces-feel-better", "design-system"];

const Line: React.FC<{ at: number; children: React.ReactNode; color?: string }> = ({ at, children, color = C.termInk }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return <div style={{ color, whiteSpace: "pre" }}>{children}</div>;
};

const Prompt: React.FC<{ dir: string }> = ({ dir }) => (
  <span>
    <span style={{ color: C.termGreen }}>{dir}</span>
    <span style={{ color: C.termMuted }}> $ </span>
  </span>
);

const Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useLayout();
  const e = useEnter(0, 20);
  const lh = 1.7;
  const fs = (vertical ? 27 : 29) * u;
  return (
    <div
      style={{
        flex: vertical ? "0 0 auto" : "1 1 58%",
        height: vertical ? 640 * u : 720 * u,
        background: C.term,
        borderRadius: 22 * u,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(17,17,19,0.18), 0 2px 6px rgba(17,17,19,0.08)",
        opacity: e,
        transform: `translateY(${(1 - e) * 30 * u}px)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: 52 * u, background: C.termBar, display: "flex", alignItems: "center", gap: 10 * u, padding: `0 ${22 * u}px` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 14 * u, height: 14 * u, borderRadius: 14, background: c }} />
        ))}
        <div style={{ flex: 1, textAlign: "center", fontFamily: SANS, fontSize: 20 * u, color: C.termMuted, marginRight: 60 * u }}>Terminal</div>
      </div>
      <div style={{ flex: 1, overflow: "hidden", padding: `${30 * u}px ${34 * u}px` }}>
        <div style={{ fontFamily: MONO, fontSize: fs, lineHeight: lh, color: C.termInk }}>
          <div><Prompt dir="~" /><Typed text="auto-skills on" at={T.on} cursor={frame < T.onOut} /></div>
          <Line at={T.onOut} color={C.termMuted}>auto-skills: on · picks skills per project</Line>
          <div style={{ height: fs * 0.6 }} />
          {frame >= T.cdVid - 20 && (
            <div><Prompt dir="~" /><Typed text="cd launch-video && claude" at={T.cdVid} cursor={frame < T.vidPick} /></div>
          )}
          <Line at={T.vidPick} color={C.termMuted}>⏺ Picking skills for this project…</Line>
          <Line at={T.vidMatch}>
            <span style={{ color: C.termAccent }}>auto-skills</span> matched <span style={{ color: C.termGreen }}>remotion</span>, <span style={{ color: C.termGreen }}>react</span>
          </Line>
          <Line at={T.vidMatch + 8} color={C.termMuted}>  → 4 skills on for launch-video</Line>
          <div style={{ height: fs * 0.6 }} />
          {frame >= T.cdApp - 20 && (
            <div><Prompt dir="~/launch-video" /><Typed text="cd ../my-app && claude" at={T.cdApp} cursor={frame < T.appPick} /></div>
          )}
          <Line at={T.appPick} color={C.termMuted}>⏺ Picking skills for this project…</Line>
          <Line at={T.appMatch}>
            <span style={{ color: C.termAccent }}>auto-skills</span> matched <span style={{ color: C.termGreen }}>next</span>, <span style={{ color: C.termGreen }}>tailwindcss</span>
          </Line>
          <Line at={T.appMatch + 8} color={C.termMuted}>  → 4 skills on for my-app</Line>
        </div>
      </div>
    </div>
  );
};

const SkillsPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useLayout();
  const e = useEnter(8, 20);
  const app = frame >= T.appMatch;
  const project = frame < T.vidMatch ? "—" : app ? "my-app" : "launch-video";
  const exitAt = T.appMatch - 4;
  const count = frame < T.vidPills ? 0 : frame < exitAt ? 4 : frame < T.appPills ? 0 : 4;
  const k = 4 / ALL_SKILLS.length;
  const fill = interpolate(frame, [T.vidPills, T.vidPills + 24, exitAt, exitAt + 10, T.appPills, T.appPills + 24], [0, k, k, 0, 0, k], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        flex: vertical ? "0 0 auto" : "1 1 42%",
        height: vertical ? 600 * u : 720 * u,
        background: C.card,
        borderRadius: 22 * u,
        border: `${1.5 * u}px solid ${C.faint}`,
        padding: `${38 * u}px ${40 * u}px`,
        display: "flex",
        flexDirection: "column",
        gap: 26 * u,
        opacity: e,
        transform: `translateY(${(1 - e) * 30 * u}px)`,
      }}
    >
      <div style={{ fontFamily: SANS, fontSize: 22 * u, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 2 * u }}>Skills in this session</div>
      <div style={{ fontFamily: MONO, fontSize: 40 * u, fontWeight: 500, color: C.ink }}>{project}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 * u, alignItems: "flex-start", }}>
        {frame < exitAt + 10 && VIDEO_SKILLS.map((s, i) => <Pill key={`v-${s}`} label={s} at={T.vidPills + i * 6} exitAt={exitAt} tone="accent" />)}
        {frame >= exitAt + 10 && APP_SKILLS.map((s, i) => <Pill key={`a-${s}`} label={s} at={T.appPills + i * 6} tone="accent" />)}
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 14 * u }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24 * u, color: C.muted }}>
          <span>skills in context</span>
          <span style={{ color: count ? C.ok : C.muted }}>{count} / {ALL_SKILLS.length}</span>
        </div>
        <div style={{ height: 18 * u, borderRadius: 999, background: C.faint, overflow: "hidden" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 999, background: C.ok }} />
        </div>
      </div>
    </div>
  );
};

// 270–750 overall (480 frames): turn it on, open two projects, watch the skills swap.
export const Demo: React.FC = () => {
  const { u, vertical } = useLayout();
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        padding: vertical ? `${140 * u}px ${60 * u}px` : `${90 * u}px ${110 * u}px`,
        flexDirection: vertical ? "column" : "row",
        alignItems: vertical ? "stretch" : "center",
        justifyContent: "center",
        gap: 36 * u,
      }}
    >
      <Terminal />
      <SkillsPanel />
    </AbsoluteFill>
  );
};
