import { Composition } from "remotion";
import { EccentricDemo } from "./EccentricDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EccentricDemo"
        component={EccentricDemo}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
