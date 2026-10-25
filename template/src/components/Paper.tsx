import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../lib/theme";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(%23n)' opacity='0.55'/></svg>\")";

/** Paper base: warm stock, grain, optional halftone corner. */
export const PaperBg: React.FC<{
  tone?: string;
  dots?: "tl" | "tr" | "bl" | "br" | "none";
  dotColor?: string;
  vignette?: boolean;
}> = ({ tone = C.paper, dots = "tr", dotColor = C.ink, vignette = true }) => {
  const corner: Record<string, React.CSSProperties> = {
    tl: { left: -120, top: -120 },
    tr: { right: -120, top: -120 },
    bl: { left: -120, bottom: -120 },
    br: { right: -120, bottom: -120 },
    none: {},
  };
  return (
    <AbsoluteFill style={{ background: tone, overflow: "hidden" }}>
      {dots !== "none" && (
        <div
          style={{
            position: "absolute",
            width: 620,
            height: 620,
            opacity: 0.16,
            backgroundImage: `radial-gradient(${dotColor} 3.4px, transparent 3.6px)`,
            backgroundSize: "24px 24px",
            ...corner[dots],
          }}
        />
      )}
      {vignette && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 90% at 50% 45%, rgba(255,255,255,0) 55%, rgba(120,96,50,0.10) 100%)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: GRAIN,
          opacity: 0.3,
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};

/** Torn paper edge as a clip-path polygon (top or bottom). */
export const torn = (edge: "top" | "bottom", seed = 1): string => {
  const n = 26;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    const r = Math.abs(Math.sin(i * 2.7 + seed * 5.3)) * 4.2 + Math.abs(Math.cos(i * 1.3 + seed)) * 2.2;
    pts.push(`${x.toFixed(2)}% ${(edge === "top" ? r : 100 - r).toFixed(2)}%`);
  }
  return edge === "top"
    ? `polygon(${pts.join(",")}, 100% 100%, 0% 100%)`
    : `polygon(0% 0%, 100% 0%, ${pts.reverse().join(",")})`;
};

/** A torn paper band across the frame. */
export const TornBand: React.FC<{
  top?: number;
  bottom?: number;
  height: number;
  color?: string;
  seed?: number;
  rotate?: number;
  edge?: "top" | "bottom";
}> = ({ top, bottom, height, color = C.white, seed = 1, rotate = 0, edge = "top" }) => (
  <div
    style={{
      position: "absolute",
      left: -40,
      width: 2000,
      height,
      top,
      bottom,
      background: color,
      clipPath: `${torn(edge, seed)}`,
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 10px 0 rgba(22,22,22,0.07)",
    }}
  />
);
