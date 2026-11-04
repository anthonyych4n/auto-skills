import React from "react";
import { AbsoluteFill } from "remotion";
import { Headline, useEnter, useLayout } from "../components";
import { C, MONO } from "../theme";

// 750–900 (150 frames): the payoff and how to get it.
export const Outro: React.FC = () => {
  const { u, vertical } = useLayout();
  const cmd = useEnter(56, 20);
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        justifyContent: "center",
        alignItems: vertical ? "flex-start" : "center",
        textAlign: vertical ? "left" : "center",
        padding: vertical ? `0 ${80 * u}px` : `0 ${160 * u}px`,
        gap: 56 * u,
      }}
    >
      <div>
        <Headline at={0} size={vertical ? 104 : 112}>Right skills.</Headline>
        <Headline at={12} size={vertical ? 104 : 112}>Every project.</Headline>
        <Headline at={24} size={vertical ? 104 : 112} color={C.accent}>Automatically.</Headline>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 * u, opacity: cmd, transform: `translateY(${(1 - cmd) * 20 * u}px)` }}>
        <div
          style={{
            alignSelf: vertical ? "flex-start" : "center",
            fontFamily: MONO,
            fontSize: (vertical ? 30 : 34) * u,
            color: C.termInk,
            background: C.term,
            padding: `${18 * u}px ${28 * u}px`,
            borderRadius: 14 * u,
          }}
        >
          <span style={{ color: C.termMuted }}>/plugin install </span>auto-skills@auto-skills
        </div>
        <div style={{ fontFamily: MONO, fontSize: 28 * u, color: C.muted }}>github.com/anthonyych4n/auto-skills</div>
      </div>
    </AbsoluteFill>
  );
};
