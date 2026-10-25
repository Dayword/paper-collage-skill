import "./index.css";
import { Composition } from "remotion";
import { Promo } from "./Promo";
import timing from "./timing.json";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Promo"
      component={Promo}
      durationInFrames={Math.round(timing.duration * timing.fps)}
      fps={timing.fps}
      width={timing.width}
      height={timing.height}
      defaultProps={{ withAudio: true }}
    />
  );
};
