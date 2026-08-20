import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate, spring } from "remotion";
import { colors } from "../lib/colors";

const lookInto = [
  "Cash runway below 12 months",
  "Customer concentration above 30%",
  "LTV/CAC below 3.0x",
  "Operating leverage misaligned",
];

export const Scene06Verdict = () => {
  const frame = useCurrentFrame();
  const score = interpolate(frame, [30, 90], [0, 78], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const ring = spring({ frame: frame - 20, fps: 30, config: { damping: 20, stiffness: 100 } });
  const cards = spring({ frame: frame - 80, fps: 30, config: { damping: 18, stiffness: 120 } });
  const report = spring({ frame: frame - 105, fps: 30, config: { damping: 22, stiffness: 140 } });

  const circumference = 2 * Math.PI * 140;
  const dashOffset = circumference - (score / 100) * circumference;

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
          top: 140,
          textAlign: "center",
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
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
          The Verdict
        </div>
      </div>

      <div
        style={{
          width: 340,
          height: 340,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${ring})`,
          opacity: ring,
        }}
      >
        <svg width={340} height={340} viewBox="0 0 340 340">
          <circle cx={170} cy={170} r={140} fill="none" stroke={colors.navyMid} strokeWidth={12} opacity={0.4} />
          <circle
            cx={170}
            cy={170}
            r={140}
            fill="none"
            stroke={colors.gold}
            strokeWidth={12}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 170 170)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 72,
              fontWeight: 700,
              color: colors.ivory,
            }}
          >
            {Math.round(score)}
          </div>
          <div
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: colors.gold,
              textTransform: "uppercase",
            }}
          >
            Integrated Score
          </div>
        </div>
      </div>

      <div
        style={{
          width: 760,
          marginTop: 60,
          opacity: cards,
          transform: `translateY(${(1 - cards) * 40}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: colors.oxblood,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Areas to Look Into
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {lookInto.map((item, i) => (
            <div
              key={i}
              style={{
                background: `${colors.oxblood}12`,
                borderLeft: `3px solid ${colors.oxblood}`,
                padding: "14px 18px",
                borderRadius: 4,
                fontFamily: "Manrope, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: colors.ivory,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: 560,
          height: 140,
          background: colors.ivory,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: report,
          transform: `scale(${0.85 + report * 0.15})`,
          boxShadow: `0 0 60px ${colors.gold}30`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 28,
              fontWeight: 700,
              color: colors.navy,
            }}
          >
            LetNumbersTalk Report
          </div>
          <div
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: colors.gold,
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            PDF-ready · Browser-native
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
