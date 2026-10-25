import React from "react";
import { AbsoluteFill } from "remotion";
import { EASE, ramp, scene, shake, impulse } from "../lib/anim";
import { C, FONT } from "../lib/theme";
import { PaperBg, TornBand } from "../components/Paper";
import { Phone } from "../components/Phone";
import { Counter, Duck, HandArrow, Hl, Stamp, Sticker } from "../components/Bits";

/** 场景在自己的时间窗外返回 null —— 全片时间由 timing.json 唯一决定。 */
const fadeOut = (t: number, end: number, dur = 0.3) =>
  1 - ramp(t, [end - dur, end], [0, 1], EASE.in);

/* ------------------------------------------------------------------ 1. hook */
export const HookScene: React.FC<{ t: number }> = ({ t }) => {
  const s = scene("hook");
  if (t < s.start || t >= s.end) return null;

  const line1 = ramp(t, [s.start + 0.15, s.start + 0.5], [0, 1], EASE.back);
  const line2 = ramp(t, [s.start + 0.6, s.start + 0.95], [0, 1], EASE.back);
  const tag = ramp(t, [s.start + 2.7, s.start + 3.0], [0, 1], EASE.back);
  const qs = ["这个多少钱？", "卡里还剩多少？", "东西丢了找谁？"];

  return (
    <AbsoluteFill style={{ opacity: fadeOut(t, s.end) }}>
      <PaperBg dots="tr" />
      <div
        style={{
          position: "absolute",
          left: 148,
          top: 92,
          fontFamily: FONT.display,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: 6,
          color: "#8A7A5C",
          opacity: ramp(t, [s.start, s.start + 0.3]),
        }}
      >
        示 例 · 纸 质 拼 贴 宣 传 片
      </div>

      <div style={{ position: "absolute", left: 148, top: 208 }}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 104,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: -3,
            lineHeight: 1.2,
            opacity: line1,
            transform: `translateY(${(1 - line1) * 40}px)`,
          }}
        >
          问清楚一件事，
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 136,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: -5,
            lineHeight: 1.16,
            opacity: line2,
            transform: `translateY(${(1 - line2) * 46}px)`,
          }}
        >
          <Hl>比排队还难</Hl>
        </div>
      </div>

      {qs.map((q, i) => {
        const p = ramp(t, [s.start + 0.95 + i * 0.5, s.start + 1.22 + i * 0.5], [0, 1], EASE.back);
        return (
          <div
            key={q}
            style={{
              position: "absolute",
              right: [132, 214, 158][i],
              top: [236, 384, 532][i],
              transform: `rotate(${[-3, 2.4, -2][i]}deg)`,
            }}
          >
            <Sticker color={C.white} fontSize={36} rotate={0} e={p} padding="18px 34px 22px">
              <span style={{ color: C.orange, marginRight: 10 }}>?</span>
              {q}
            </Sticker>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 640, bottom: 62, opacity: ramp(t, [s.start + 1.6, s.start + 2.2]) }}>
        <svg width={470} height={290} viewBox="0 0 520 300">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i * 118}, ${i % 2 ? 18 : 0})`} opacity={ramp(t, [s.start + 1.6 + i * 0.12, s.start + 1.9 + i * 0.12])}>
              <circle cx="60" cy="62" r="30" fill="none" stroke={C.ink} strokeWidth="9" />
              <path
                d="M60 92 L60 186 M60 116 L24 156 M60 116 L98 154 M60 186 L26 250 M60 186 L96 250"
                stroke={C.ink}
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ position: "absolute", left: 148, top: 690, opacity: tag }}>
        <Sticker color={C.red} text={C.white} fontSize={38} rotate={-3.5} e={tag} padding="16px 32px 20px">
          问完这一句，还有下一句
        </Sticker>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------- 2. feature（手机贴纸 + 数字） */
const MockChat: React.FC = () => (
  <div style={{ width: "100%", height: "100%", background: "#EDEDED", display: "flex", flexDirection: "column", fontFamily: FONT.body }}>
    <div style={{ background: "#FFFFFF", padding: "30px 22px 20px", borderBottom: "1px solid #E4E4E4" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 24, background: C.yellow, border: `3px solid ${C.ink}` }} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#111" }}>鸭先知</div>
          <div style={{ fontSize: 18, color: "#8A8A8A", marginTop: 2 }}>在线 · 随时问</div>
        </div>
      </div>
    </div>

    <div style={{ flex: 1, padding: "26px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          alignSelf: "flex-end",
          background: "#95EC69",
          padding: "16px 20px",
          borderRadius: "16px 4px 16px 16px",
          fontSize: 23,
          color: "#111",
          maxWidth: "78%",
          lineHeight: 1.4,
        }}
      >
        帮我办张 200 元的卡
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          background: "#FFFFFF",
          padding: "16px 20px",
          borderRadius: "4px 16px 16px 16px",
          fontSize: 23,
          color: "#111",
          maxWidth: "88%",
          lineHeight: 1.45,
        }}
      >
        办好啦！200 元档已到账 <b>320 币</b>，现在可用 1444 币。
      </div>
      <div style={{ alignSelf: "flex-start", background: "#FFFFFF", borderRadius: 16, padding: 18, width: "88%" }}>
        <div style={{ fontSize: 19, color: "#888" }}>会员卡 · 200 元档</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#111", marginTop: 4 }}>
          320 <span style={{ fontSize: 22 }}>币</span>
        </div>
        <div
          style={{
            marginTop: 16,
            background: C.orange,
            color: "#FFFFFF",
            textAlign: "center",
            padding: "14px 0",
            borderRadius: 12,
            fontSize: 23,
            fontWeight: 700,
          }}
        >
          立即办理
        </div>
      </div>
    </div>

    <div style={{ background: "#FFFFFF", padding: "16px 20px", display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ flex: 1, height: 44, background: "#F2F2F2", borderRadius: 22 }} />
      <div style={{ width: 44, height: 44, borderRadius: 22, background: "#07C160" }} />
    </div>
  </div>
);

export const FeatureScene: React.FC<{ t: number }> = ({ t }) => {
  const s = scene("feature");
  if (t < s.start || t >= s.end) return null;

  const head = ramp(t, [s.start + 0.1, s.start + 0.45], [0, 1], EASE.back);
  const card = ramp(t, [s.start + 0.6, s.start + 0.9], [0, 1], EASE.back);
  const phone = ramp(t, [s.start + 0.15, s.start + 0.55], [0, 1], EASE.back);
  const hit = impulse(t, s.start + 1.9, 4);
  const stamp = ramp(t, [s.start + 1.9, s.start + 2.05], [0, 1], EASE.back);
  const sh = shake(t, [s.start + 1.9], 7, 9);

  return (
    <AbsoluteFill style={{ opacity: fadeOut(t, s.end), transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <PaperBg dots="bl" />

      <div style={{ position: "absolute", left: 140, top: 118, fontFamily: FONT.display, fontSize: 26, fontWeight: 600, letterSpacing: 6, color: "#8A7A5C", opacity: ramp(t, [s.start, s.start + 0.3]) }}>
        能 办 事
      </div>

      <div style={{ position: "absolute", left: 140, top: 186, opacity: head, transform: `translateY(${(1 - head) * 34}px)` }}>
        <div style={{ fontFamily: FONT.display, fontSize: 92, fontWeight: 700, color: C.ink, letterSpacing: -3, lineHeight: 1.18 }}>
          它不只回答，
        </div>
        <div style={{ fontFamily: FONT.display, fontSize: 92, fontWeight: 700, color: C.ink, letterSpacing: -3, lineHeight: 1.18 }}>
          <Hl>还能把事办完</Hl>
        </div>
      </div>

      <div style={{ position: "absolute", left: 140, top: 440, opacity: card, transform: `translateY(${(1 - card) * 30}px)` }}>
        <Sticker color={C.ink} text={C.yellow} fontSize={36} rotate={-2} border={5} padding="16px 30px 20px">
          「帮我办张 200 元的卡」
        </Sticker>
      </div>

      <div style={{ position: "absolute", left: 140, top: 570, display: "flex", alignItems: "baseline", gap: 18, opacity: card }}>
        <span style={{ fontFamily: FONT.display, fontSize: 60, fontWeight: 700, color: "#B4A788" }}>到账</span>
        <span style={{ fontFamily: FONT.display, fontSize: 132, fontWeight: 700, color: C.ink, letterSpacing: -4, fontVariantNumeric: "tabular-nums" }}>
          <Counter t={t} from={0} to={320} start={s.start + 0.75} dur={0.9} suffix=" 币" />
        </span>
      </div>

      <div style={{ position: "absolute", left: 470, top: 760, opacity: stamp, transform: `scale(${1.4 - 0.4 * stamp + hit * 0.04})` }}>
        <Stamp rotate={-9} e={1} fontSize={44}>
          已 到 账
        </Stamp>
      </div>

      <div style={{ position: "absolute", left: 830, top: 640, opacity: card * 0.9 }}>
        <HandArrow width={190} />
      </div>

      <Phone left={1120} top={58} width={430} rotate={2.4} e={phone}>
        <MockChat />
      </Phone>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- 3. end */
export const EndScene: React.FC<{ t: number }> = ({ t }) => {
  const s = scene("end");
  if (t < s.start || t >= s.end) return null;

  const hit = impulse(t, s.start + 0.05, 3.4);
  const sh = shake(t, [s.start + 0.05], 10, 7);
  const p = ramp(t, [s.start + 0.1, s.start + 0.5], [0, 1], EASE.back);
  const p2 = ramp(t, [s.start + 0.55, s.start + 0.95], [0, 1], EASE.back);

  return (
    <AbsoluteFill style={{ background: C.yellow, transform: `translate(${sh.x}px, ${sh.y}px) scale(${1 + hit * 0.02})` }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.ink} 3px, transparent 3.2px)`, backgroundSize: "26px 26px", opacity: 0.16 }} />
      <TornBand top={-40} height={252} color={C.paper} seed={3} rotate={-1.2} edge="bottom" />
      <TornBand bottom={-40} height={232} color={C.paper} seed={5} rotate={1.1} edge="top" />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
          <Duck size={186} wink />
          <div style={{ fontFamily: FONT.display, fontSize: 152, fontWeight: 700, letterSpacing: 10, color: C.ink, lineHeight: 1 }}>鸭先知</div>
        </div>
        <div style={{ marginTop: 34, fontFamily: FONT.display, fontSize: 56, fontWeight: 700, color: C.ink, letterSpacing: 2, opacity: p2 }}>
          能办事的游乐园智能体
        </div>
        <div style={{ marginTop: 28, display: "inline-block", background: C.ink, color: C.yellow, padding: "14px 34px 18px", fontFamily: FONT.display, fontSize: 38, fontWeight: 700, letterSpacing: 2, opacity: p2 }}>
          问一句，就办好了
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 74, textAlign: "center", fontFamily: FONT.display, fontSize: 24, letterSpacing: 6, color: "rgba(22,22,22,0.5)", opacity: p2 }}>
        换掉文案、换掉截图，就是你的片子
      </div>
    </AbsoluteFill>
  );
};
