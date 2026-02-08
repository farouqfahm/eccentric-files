import { Composition } from "remotion";
import { KGLPitch } from "./KGLPitch";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KGLPitch"
        component={KGLPitch}
        durationInFrames={1800} // 60 seconds at 30fps (12 slides × 5 sec)
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
