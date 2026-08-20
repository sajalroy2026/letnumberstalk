import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate, spring } from "remotion";
import { colors } from "../lib/colors";

export const Scene07Close = () => {
  const frame = useCurrentFrame();
  const collapse = spring({ frame: frame - 5, fps: 30, config: { damping: 25, stiffness: 120 } });
  const point = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 4) });
  const reveal = spring({ frame: frame - 35, fps: 30, config: { damping: 18, stiffness: 100 } });

  const rings = Array.from({ length: 6 }).map((_, i) => {
    const r = 40 + i * 60;
    const opacity = interpolate(frame, [5 + i * 3, 25 + i * 3], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
            cy={960}
            r={ring.r * (1 - point * 0.85)}
            fill="none"
            stroke={colors.gold}
            strokeWidth={2}
            opacity={ring.opacity}
          />
        ))}
        <circle cx={540} cy={960} r={8 + point * 6} fill={colors.gold} opacity={point} />
      </svg>

      <div
        style={{
          textAlign: "center",
          opacity: reveal,
          transform: `scale(${0.92 + reveal * 0.08})`,
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
