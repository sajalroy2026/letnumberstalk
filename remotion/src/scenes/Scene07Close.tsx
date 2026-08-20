import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate, spring } from "remotion";
import { colors } from "../lib/colors";

export const Scene07Close = () => {
  const frame = useCurrentFrame();
  const point = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });
  const reveal = spring({ frame: frame - 45, fps: 30, config: { damping: 18, stiffness: 100 } });
  const pointFade = interpolate(frame, [35, 55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rings = Array.from({ length: 6 }).map((_, i) => {
    const r = 30 + i * 45;
    const opacity = interpolate(frame, [5 + i * 3, 25 + i * 3], [0.55, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { r, opacity };
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={540}
            cy={720}
            r={ring.r * (1 - point * 0.88)}
            fill="none"
            stroke={colors.gold}
            strokeWidth={2}
            opacity={ring.opacity * pointFade}
          />
        ))}
        <circle
          cx={540}
          cy={720}
          r={6 + point * 8}
          fill={colors.gold}
          opacity={pointFade}
        />
      </svg>

      <div
        style={{
          textAlign: "center",
          opacity: reveal,
          transform: `scale(${0.92 + reveal * 0.08}) translateY(${(1 - reveal) * 30}px)`,
          marginTop: 320,
        }}
      >
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 82,
            fontWeight: 700,
            color: colors.ivory,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          LetNumbersTalk
        </div>
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 26,
            fontWeight: 600,
            color: colors.gold,
            letterSpacing: "0.12em",
            marginTop: 24,
          }}
        >
          By Mr. Sajal Roy
        </div>
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 18,
            fontWeight: 500,
            color: colors.steel,
            letterSpacing: "0.08em",
            marginTop: 48,
            lineHeight: 1.8,
          }}
        >
          Free. No login.<br />Runs entirely in your browser.
        </div>
      </div>
    </AbsoluteFill>
  );
};
