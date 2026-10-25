import React from "react";
import { EASE, ramp } from "../lib/anim";
import { C, FONT, shadow } from "../lib/theme";

export const Sticker: React.FC<{
  children: React.ReactNode;
  color?: string;
  text?: string;
  fontSize?: number;
  rotate?: number;
  e?: number;
  border?: number;
  shadowSize?: number;
  padding?: string;
  radius?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  color = C.yellow,
  text = C.ink,
  fontSize = 34,
  rotate = -4,
  e = 1,
  border = 6,
  shadowSize = 8,
  padding = "14px 30px 18px",
  radius = 16,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      background: color,
      color: text,
      border: `${border}px solid ${C.ink}`,
      borderRadius: radius,
      padding,
      fontFamily: FONT.display,
      fontWeight: 700,
      fontSize,
      lineHeight: 1.25,
      letterSpacing: 0.5,
      boxShadow: shadow(shadowSize),
      transform: `rotate(${rotate}deg) scale(${0.7 + 0.3 * e})`,
      opacity: e,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Big headline with a yellow marker block behind one phrase. */
export const Hl: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = C.yellow,
}) => (
  <span style={{ position: "relative", display: "inline-block", zIndex: 1 }}>
    <span
      style={{
        position: "absolute",
        left: -8,
        right: -10,
        bottom: "0.06em",
        height: "0.52em",
        background: color,
        transform: "rotate(-1deg)",
        zIndex: -1,
      }}
    />
    {children}
  </span>
);

export const HandArrow: React.FC<{
  width?: number;
  flip?: boolean;
  color?: string;
  dash?: boolean;
  style?: React.CSSProperties;
}> = ({ width = 220, flip = false, color = C.ink, dash = false, style }) => (
  <svg
    width={width}
    height={width * 0.72}
    viewBox="0 0 240 172"
    fill="none"
    style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}
  >
    <path
      d="M10 24 C 92 2, 168 46, 190 118"
      stroke={color}
      strokeWidth={9}
      strokeLinecap="round"
      strokeDasharray={dash ? "12 14" : undefined}
    />
    <path d="M166 110 L 194 128 L 202 94" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Duck: React.FC<{ size?: number; style?: React.CSSProperties; wink?: boolean }> = ({
  size = 140,
  style,
  wink = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
    <ellipse cx="98" cy="130" rx="66" ry="50" fill={C.yellow} stroke={C.ink} strokeWidth={9} />
    <circle cx="112" cy="76" r="41" fill={C.yellow} stroke={C.ink} strokeWidth={9} />
    <path d="M150 74 q 32 6 27 21 q -5 12 -31 5" fill={C.orange} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    {wink ? (
      <path d="M112 64 q 10 -8 20 0" stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
    ) : (
      <circle cx="123" cy="66" r="7" fill={C.ink} />
    )}
    <path d="M60 80 q -15 -7 -24 4 q 13 10 27 5" fill="#EDA318" stroke={C.ink} strokeWidth={7} />
  </svg>
);

/** Rubber-stamp look for confirmed numbers. */
export const Stamp: React.FC<{
  children: React.ReactNode;
  rotate?: number;
  e?: number;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, rotate = -8, e = 1, color = C.red, fontSize = 40, style }) => (
  <div
    style={{
      display: "inline-block",
      border: `6px solid ${color}`,
      color,
      borderRadius: 10,
      padding: "8px 22px 12px",
      fontFamily: FONT.display,
      fontWeight: 700,
      fontSize,
      letterSpacing: 2,
      transform: `rotate(${rotate}deg) scale(${1.35 - 0.35 * e})`,
      opacity: e,
      mixBlendMode: "multiply",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Count-up number that lands with a small overshoot. */
export const Counter: React.FC<{
  t: number;
  from: number;
  to: number;
  start: number;
  dur?: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ t, from, to, start, dur = 0.8, suffix = "", style }) => {
  const p = ramp(t, [start, start + dur], [0, 1], EASE.out);
  const v = Math.round(from + (to - from) * p);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {v.toLocaleString("en-US")}
      {suffix}
    </span>
  );
};
