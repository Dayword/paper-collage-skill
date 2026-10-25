import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./lib/fonts";
import { C } from "./lib/theme";
import { EndScene, FeatureScene, HookScene } from "./scenes/Demo";

export type PromoProps = { withAudio: boolean; webMode?: boolean };

/**
 * 主合成：场景按顺序叠在一起，每个场景自己判断时间窗，窗外返回 null。
 * 加场景 = timing.json 加 key + 这里插一行 + scenes/ 里写组件。
 */
export const Promo: React.FC<PromoProps> = ({ withAudio, webMode = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <HookScene t={t} />
      <FeatureScene t={t} />
      <EndScene t={t} />
      {withAudio &&
        (webMode ? (
          // @remotion/media 在浏览器跑不满帧时会重复排程音频块，叠成多重回音；网页预览改用 <audio>
          <Html5Audio src={staticFile("audio/mix.wav")} />
        ) : (
          <Audio src={staticFile("audio/mix.wav")} />
        ))}
    </AbsoluteFill>
  );
};
