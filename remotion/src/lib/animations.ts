import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const useAnim = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps };
};

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const useEnter = (
  delay: number,
  duration: number,
  from: number,
  to: number
) => {
  const { frame, fps } = useAnim();
  return interpolate(frame, [delay, delay + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutCubic,
  });
};

export const useSpringEnter = (
  delay: number,
  config?: { damping?: number; stiffness?: number; mass?: number }
) => {
  const { frame, fps } = useAnim();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 200, mass: 1, ...config },
  });
};

export const useCount = (
  delay: number,
  duration: number,
  target: number,
  decimals = 0
) => {
  const value = useEnter(delay, duration, 0, target);
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const useOsc = (
  delay: number,
  speed: number,
  amplitude: number,
  offset = 0
) => {
  const { frame } = useAnim();
  return Math.sin((frame - delay) * speed + offset) * amplitude;
};
