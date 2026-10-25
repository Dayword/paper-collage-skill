import React from "react";
import { Img, staticFile } from "remotion";
import { C, shadow } from "../lib/theme";

const RATIO = 1346 / 585;

/**
 * 手机贴纸框。两种用法：
 *   1. 传 src —— 装一张真机截图（推荐，585×1346 或同比例）
 *   2. 传 children —— 用代码画一个假界面（模板自带的 demo 就是这么做的）
 * zoom / fx / fy 用来在框内做焦点裁切：截图信息太小、需要推近某一块时用。
 */
export const Phone: React.FC<{
  src?: string;
  children?: React.ReactNode;
  left: number;
  top: number;
  width: number;
  rotate?: number;
  /** 1 = 全图；>1 以 fx/fy 为中心推近 */
  zoom?: number;
  /** 焦点，0..1 */
  fx?: number;
  fy?: number;
  /** 入场进度 0..1 */
  e?: number;
  border?: number;
  radius?: number;
  shadowSize?: number;
  tint?: string;
}> = ({
  src,
  children,
  left,
  top,
  width,
  rotate = 0,
  zoom = 1,
  fx = 0.5,
  fy = 0.5,
  e = 1,
  border = 9,
  radius = 34,
  shadowSize = 14,
  tint,
}) => {
  const height = width * RATIO;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        transform: `rotate(${rotate}deg) translateY(${(1 - e) * 54}px) scale(${0.94 + 0.06 * e})`,
        opacity: Math.min(1, e * 1.4),
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius,
          border: `${border}px solid ${C.white}`,
          outline: `6px solid ${C.ink}`,
          overflow: "hidden",
          background: C.white,
          boxShadow: shadow(shadowSize),
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: radius - border }}>
          {src ? (
            <Img
              src={staticFile(src)}
              style={{
                position: "absolute",
                width: `${zoom * 100}%`,
                height: `${zoom * 100}%`,
                objectFit: "cover",
                objectPosition: `${fx * 100}% ${fy * 100}%`,
                left: `${-(zoom - 1) * fx * 100}%`,
                top: `${-(zoom - 1) * fy * 100}%`,
              }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0 }}>{children}</div>
          )}
          {tint && <div style={{ position: "absolute", inset: 0, background: tint }} />}
        </div>
      </div>
    </div>
  );
};
