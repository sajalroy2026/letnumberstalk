import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../lib/colors";

const figures = [
  "2.4x",
  "18%",
  "RUNWAY",
  "$1.2M",
  "CHURN",
  "0.82",
  "EBITDA",
  "14 mo",
  "CAC",
  "LTV",
  "NET MARGIN",
  "43%",
  "GROSS MARGIN",
  "72",
  "CONCENTRATION",
  "NPS",
  "OPEX",
  "REVENUE",
  "3.1x",
  "DEBT/EBITDA",
];

export const PersistentBackground = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${colors.navyMid} 0%, ${colors.navy} 45%, #0a0f1c 100%)`,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 24 }).map((_, i) => {
        const speed = 0.8 + (i % 5) * 0.3;
        const y = ((frame * speed * 3 + i * 90) % (height + 200)) - 100;
        const x = (i * 73) % width;
        const opacity = 0.08 + (i % 3) * 0.04;
        const size = 12 + (i % 4) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontFamily: "Manrope, sans-serif",
              fontSize: size,
              color: colors.gold,
              opacity,
              transform: `translateZ(${(i % 5) * 40}px)`,
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}
          >
            {figures[i % figures.length]}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent 0px, transparent 2px, ${colors.navy} 3px, ${colors.navy} 4px)`,
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 0%, ${colors.navy} 75%, #05070d 100%)`,
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
