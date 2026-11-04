import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO, SANS } from "./theme";

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  // 1 unit = 1px at 1920 wide (landscape) or 1080 wide (portrait), scaled for portrait.
  const u = vertical ? width / 1080 : width / 1920;
  return { vertical, u, width, height };
};

/** 0→1 spring that starts at `at` (frames). */
export const useEnter = (at: number, damping = 18, durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass: 0.6 }, durationInFrames });
};

export const Pill: React.FC<{
  label: string;
  at: number;
  exitAt?: number;
  tone?: "neutral" | "accent" | "danger" | "ok";
  size?: number;
}> = ({ label, at, exitAt, tone = "neutral", size = 1 }) => {
  const frame = useCurrentFrame();
  const { u } = useLayout();
  const enter = useEnter(at);
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = enter * (1 - exit);
  const palette = {
    neutral: { bg: C.card, fg: C.ink, bd: C.faint },
    accent: { bg: C.accentSoft, fg: C.accent, bd: "#D6D6F7" },
    danger: { bg: C.dangerSoft, fg: C.danger, bd: "#F7CFD0" },
    ok: { bg: C.okSoft, fg: C.ok, bd: "#C8EBD6" },
  }[tone];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10 * u * size,
        padding: `${10 * u * size}px ${18 * u * size}px`,
        borderRadius: 999,
        background: palette.bg,
        color: palette.fg,
        border: `${1.5 * u}px solid ${palette.bd}`,
        fontFamily: MONO,
        fontSize: 24 * u * size,
        fontWeight: 500,
        whiteSpace: "nowrap",
        opacity: shown,
        transform: `translateY(${(1 - enter) * 14 * u}px) scale(${0.85 + 0.15 * shown})`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <span style={{ width: 9 * u * size, height: 9 * u * size, borderRadius: 9, background: palette.fg, opacity: 0.8 }} />
      {label}
    </div>
  );
};

export const Headline: React.FC<{ children: React.ReactNode; at: number; size?: number; color?: string; weight?: number }> = ({
  children, at, size = 76, color = C.ink, weight = 650,
}) => {
  const { u } = useLayout();
  const e = useEnter(at, 20);
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: size * u,
        fontWeight: weight,
        letterSpacing: -0.03 * size * u,
        lineHeight: 1.08,
        color,
        opacity: e,
        transform: `translateY(${(1 - e) * 24 * u}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Typed text: reveals `text` one character every `speed` frames from `at`. */
export const Typed: React.FC<{ text: string; at: number; speed?: number; cursor?: boolean }> = ({ text, at, speed = 1.4, cursor }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - at) / speed)));
  const typing = frame >= at && n < text.length;
  const blinkOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <span>
      {text.slice(0, n)}
      {cursor && frame >= at - 20 && (typing || blinkOn) ? <span style={{ background: C.termInk, color: C.term }}>&nbsp;</span> : null}
    </span>
  );
};

export const Fade: React.FC<{ children: React.ReactNode; inAt?: number; outAt?: number; len?: number }> = ({ children, inAt = 0, outAt, len = 12 }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [inAt, inAt + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b = outAt === undefined ? 1 : interpolate(frame, [outAt, outAt + len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", inset: 0, opacity: a * b }}>{children}</div>;
};
