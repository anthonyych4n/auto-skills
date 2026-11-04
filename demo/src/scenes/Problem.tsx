import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Headline, Pill, useLayout } from "../components";
import { ALL_SKILLS, C, MONO, SANS } from "../theme";

// 0–270: every skill piles into one session, the context meter fills up.
export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, vertical } = useLayout();
  const fill = interpolate(frame, [20, 200], [0.04, 0.94], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hot = interpolate(fill, [0.5, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = frame > 190 && frame < 215 ? Math.sin(frame * 2.2) * 3 * u : 0;
  const loaded = Math.min(ALL_SKILLS.length, Math.floor(interpolate(frame, [20, 20 + ALL_SKILLS.length * 4], [0, ALL_SKILLS.length], { extrapolateRight: "clamp" })));

  return (
    <AbsoluteFill style={{ background: C.bg, padding: vertical ? `${150 * u}px ${70 * u}px` : `${110 * u}px ${140 * u}px`, gap: (vertical ? 70 : 48) * u, justifyContent: vertical ? "center" : undefined }}>
      <div>
        <Headline at={0}>Claude loads every skill.</Headline>
        <Headline at={34} color={C.muted}>Every session.</Headline>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 * u, alignContent: "flex-start", flex: vertical ? undefined : 1, transform: `translateX(${shake}px)` }}>
        {ALL_SKILLS.map((s, i) => (
          <Pill key={s} label={s} at={20 + i * 4} tone={i % 9 === 4 && frame > 150 ? "danger" : "neutral"} size={vertical ? 1.12 : 1} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 * u }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26 * u, color: C.muted }}>
          <span>my-app · skills in context</span>
          <span style={{ color: hot > 0.5 ? C.danger : C.ink }}>{loaded} / {ALL_SKILLS.length}</span>
        </div>
        <div style={{ height: 22 * u, borderRadius: 999, background: C.faint, overflow: "hidden" }}>
          <div
            style={{
              width: `${fill * 100}%`,
              height: "100%",
              borderRadius: 999,
              background: `color-mix(in srgb, ${C.danger} ${hot * 100}%, ${C.accent})`,
            }}
          />
        </div>
        <div style={{ fontFamily: SANS, fontSize: 40 * u, fontWeight: 550, color: C.ink, letterSpacing: -0.5 * u, lineHeight: 1.25, opacity: interpolate(frame, [150, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          Video skills in your app repo.{vertical ? <br /> : " "}Design skills in your video repo.
        </div>
      </div>
    </AbsoluteFill>
  );
};
