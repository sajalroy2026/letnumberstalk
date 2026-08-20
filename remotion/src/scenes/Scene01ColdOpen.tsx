import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { interpolate } from "remotion";
import { colors } from "../lib/colors";

export const Scene01ColdOpen = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const lineProgress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: "clamp",
    easing: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  });

  const titleOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleScale = interpolate(frame, [35, 60], [0.88, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const sweepY = interpolate(frame, [0, 75], [-200, height + 200], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", opacity: 0.9 }}
      >
        <defs>
          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.gold} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.gold} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.gold} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1={width * 0.15}
          y1={height * 0.48}
          x2={width * 0.15 + (width * 0.7) * lineProgress}
          y2={height * 0.48}
          stroke="url(#goldLine)"
          strokeWidth={3}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          top: sweepY,
          left: 0,
          right: 0,
          height: 240,
          background: `linear-gradient(180deg, transparent 0%, ${colors.gold} 50%, transparent 100%)`,
          opacity: 0.12,
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          textAlign: "center",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 96,
            fontWeight: 700,
            color: colors.ivory,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textShadow: `0 0 60px ${colors.goldGlow}`,
          }}
        >
          Numbers Talk.
        </div>
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: colors.gold,
            letterSpacing: "0.35em",
            marginTop: 28,
            textTransform: "uppercase",
          }}
        >
          Let them speak
        </div>
      </div>
    </AbsoluteFill>
  );
};
