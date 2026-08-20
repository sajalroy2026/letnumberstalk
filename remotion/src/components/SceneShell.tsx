import { useCurrentFrame } from "remotion";
import { interpolate } from "remotion";

export const SceneShell = ({
  children,
  durationInFrames,
  fadeIn = 12,
  fadeOut = 18,
}: {
  children: React.ReactNode;
  durationInFrames: number;
  fadeIn?: number;
  fadeOut?: number;
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
