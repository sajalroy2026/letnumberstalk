import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate } from "remotion";
import { colors } from "../lib/colors";

const shards = [
  { label: "Revenue", color: colors.gold, x: 18, y: 22, r: -12 },
  { label: "Churn", color: colors.burnt, x: 72, y: 18, r: 8 },
  { label: "Runway", color: colors.forest, x: 12, y: 62, r: 18 },
  { label: "Concentration", color: colors.oxblood, x: 78, y: 58, r: -6 },
  { label: "Margin", color: colors.steel, x: 30, y: 78, r: -10 },
  { label: "Debt", color: colors.mocha, x: 68, y: 82, r: 14 },
];

export const Scene02ProblemBeat = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 105], [0, 1], { extrapolateRight: "clamp" });
  const flash = Math.floor(frame / 8) % 2 === 0 ? 0.9 : 0.5;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1200,
      }}
    >
      <div
        style={{
          fontFamily: "Fraunces, serif",
          fontSize: 52,
          fontWeight: 600,
          color: colors.ivory,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.2,
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [10, 30], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}
      >
        But most founders never learn the language.
      </div>

      {shards.map((shard, i) => {
        const dirX = (i % 2 === 0 ? -1 : 1) * (20 + (i % 3) * 15);
        const dirY = (i % 3 === 0 ? -1 : 1) * (25 + (i % 2) * 20);
        const x = shard.x + dirX * drift;
        const y = shard.y + dirY * drift;
        const opacity = interpolate(frame, [0, 20, 80, 105], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scale = 1 + drift * 0.15;
        const flicker = (i + frame) % 7 < 2 ? flash : 0.35;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${shard.r + drift * 12}deg) scale(${scale})`,
              opacity,
              zIndex: 10 + i,
            }}
          >
            <div
              style={{
                background: `${shard.color}15`,
                border: `1px solid ${shard.color}`,
                padding: "18px 28px",
                borderRadius: 6,
                boxShadow: `0 0 30px ${shard.color}40`,
                color: shard.color,
                fontFamily: "Manrope, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: flicker,
              }}
            >
              {shard.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
