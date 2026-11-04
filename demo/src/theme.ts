import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: SANS } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
export const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const C = {
  bg: "#F6F6F3",
  ink: "#111113",
  muted: "#6F6F76",
  faint: "#E4E4E0",
  card: "#FFFFFF",
  accent: "#5B5BD6",
  accentSoft: "#EBEBFC",
  danger: "#E5484D",
  dangerSoft: "#FDECEC",
  ok: "#30A46C",
  okSoft: "#E6F6EC",
  term: "#17171B",
  termBar: "#222228",
  termInk: "#EDEDEF",
  termMuted: "#8A8A93",
  termGreen: "#4CC38A",
  termAccent: "#9E9EFF",
};

// Every skill in the real library, so the pile is honest.
export const ALL_SKILLS = [
  "stageshow", "ui-ux-pro-max", "ui-styling", "design-system", "brand", "banner-design", "slides",
  "make-interfaces-feel-better", "design", "loopy", "i-have-adhd", "agent-reach", "youtube-full",
  "rea-growth", "humanizer", "instagram-reel-scriptwriter", "instagram-post-crafter",
  "resemble-detect", "remotion-best-practices", "remotion-captions", "remotion-render",
  "mattpocock-skills", "addyosmani-agent-skills", "browser-harness", "defuddle", "pdf", "docx",
  "xlsx", "pptx", "skill-creator", "mcp-builder",
];
