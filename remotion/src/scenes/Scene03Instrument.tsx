import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate, spring } from "remotion";
import { colors } from "../lib/colors";

const pillars = [
  { name: "Financial Health", weight: 22, color: colors.gold },
  { name: "Risk Management", weight: 20, color: colors.burnt },
  { name: "Market Position", weight: 18, color: colors.forest },
  { name: "Operational Efficiency", weight: 15, color: colors.oxblood },
  { name: "Strategic Positioning", weight: 13, color: colors.navyMid },
  { name: "Organizational Capability", weight: 7, color: colors.mocha },
  { name: "Technology & Systems", weight: 5, color: colors.steel },
];

export const Scene03Instrument = () => {
  const frame = useCurrentFrame();
  const orbit = interpolate(frame, [0, 150], [0, 360 * 1.2], { extrapolateRight: "clamp" });
  const snap = spring({ frame: frame - 15, fps: 30, config: { damping: 15, stiffness: 120 } });
  const labelReveal = spring({ frame: frame - 45, fps: 30, config: { damping: 20, stiffness: 100 } });

  const cx = 540;
  const cy = 960;
  const radius = 320;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1600,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 140,
          textAlign: "center",
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.3em",
            color: colors.gold,
            textTransform: "uppercase",
          }}
        >
          The Diagnostic Instrument
        </div>
      </div>

      <div
        style={{
          width: 1080,
          height: 1080,
          transform: `rotateY(${orbit * 0.25}deg) rotateX(${10 + orbit * 0.08}deg) scale(${0.6 + snap * 0.4})`,
          transformStyle: "preserve-3d",
        }}
      >
        <svg width={1080} height={1080} viewBox="0 0 1080 1080">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.gold} stopOpacity="0.25" />
              <stop offset="100%" stopColor={colors.navy} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={radius} fill="url(#radarGlow)" />
          {Array.from({ length: 4 }).map((_, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={80 + i * 80}
              fill="none"
              stroke={colors.steel}
              strokeWidth={1}
              opacity={0.25 + i * 0.08}
            />
          ))}
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
            const x2 = cx + Math.cos(angle) * radius;
            const y2 = cy + Math.sin(angle) * radius;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke={colors.steel}
                strokeWidth={1}
                opacity={0.3}
              />
            );
          })}
          {pillars.map((_, i) => {
            const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
            const r = radius * (0.4 + (i % 3) * 0.2);
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={6 + (i % 4)}
                fill={pillars[i].color}
                opacity={0.8}
              />
            );
          })}
          <circle
            cx={cx + Math.cos((orbit * Math.PI) / 180) * (radius - 40)}
            cy={cy + Math.sin((orbit * Math.PI) / 180) * (radius - 40)}
            r={10}
            fill={colors.gold}
          />
        </svg>
      </div>

      {pillars.map((pillar, i) => {
        const angle = (i / 7) * Math.PI * 2 - Math.PI / 2;
        const dist = 460;
        const x = 50 + (Math.cos(angle) * dist) / 1080 * 100;
        const y = 50 + (Math.sin(angle) * dist) / 1920 * 100;
        const delay = 55 + i * 8;
        const show = interpolate(frame, [delay, delay + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const slide = interpolate(frame, [delay, delay + 18], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) translateY(${slide}px)`,
              opacity: show * labelReveal,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 17,
                fontWeight: 800,
                color: pillar.color,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {pillar.name}
            </div>
            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: 42,
                fontWeight: 700,
                color: colors.ivory,
                marginTop: 4,
              }}
            >
              {pillar.weight}%
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
