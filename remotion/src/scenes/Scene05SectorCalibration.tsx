import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate, spring } from "remotion";
import { colors } from "../lib/colors";

const industries = [
  { name: "Services", color: colors.navyMid, trait: "Project margin & utilisation" },
  { name: "Manufacturing", color: colors.forest, trait: "Inventory & throughput" },
  { name: "Retail / D2C", color: colors.burnt, trait: "Gross margin & repeat rate" },
  { name: "SaaS / Subscription", color: colors.gold, trait: "LTV/CAC & net revenue retention" },
  { name: "Startup", color: colors.oxblood, trait: "Runway & burn efficiency" },
];

export const Scene05SectorCalibration = () => {
  const frame = useCurrentFrame();
  const title = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 160,
          textAlign: "center",
          opacity: title,
          transform: `translateY(${(1 - title) * 30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.3em",
            color: colors.gold,
            textTransform: "uppercase",
          }}
        >
          Calibrated for
        </div>
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 52,
            fontWeight: 700,
            color: colors.ivory,
            marginTop: 12,
          }}
        >
          5 Industry Profiles
        </div>
      </div>

      {industries.map((ind, i) => {
        const start = 25 + i * 18;
        const end = start + 16;
        const show = spring({ frame: frame - start, fps: 30, config: { damping: 18, stiffness: 160 } });
        const exit = interpolate(frame, [end, end + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = Math.min(show, exit);
        const scale = 0.7 + show * 0.3;
        const rotateY = (1 - show) * 90;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 720,
              height: 420,
              background: `linear-gradient(135deg, ${ind.color}22 0%, ${colors.navy}88 100%)`,
              border: `2px solid ${ind.color}`,
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity,
              transform: `scale(${scale}) rotateY(${rotateY}deg)`,
              boxShadow: `0 0 80px ${ind.color}40`,
              backfaceVisibility: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: 64,
                fontWeight: 700,
                color: ind.color,
                textAlign: "center",
              }}
            >
              {ind.name}
            </div>
            <div
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: colors.ivory,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: 20,
              }}
            >
              {ind.trait}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
