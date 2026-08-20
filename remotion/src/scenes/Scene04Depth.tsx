import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate, spring } from "remotion";
import { colors } from "../lib/colors";

const metrics = [
  "Gross Margin", "Net Margin", "EBITDA Margin", "Operating Cash Flow", "Free Cash Flow",
  "Current Ratio", "Quick Ratio", "Debt/EBITDA", "Interest Coverage", "Cash Runway",
  "Revenue Growth", "CAC", "LTV/CAC", "Payback Period", "Customer Concentration",
  "Churn Rate", "NPS", "Market Share", "Brand Equity", "Pipeline Velocity",
  "Inventory Turnover", "Opex Ratio", "Capacity Utilisation", "Cycle Time", "Defect Rate",
  "Strategic Clarity", "Moat Index", "Innovation Rate", "Partnership Strength", "ESG Score",
  "Talent Density", "Span of Control", "Decision Velocity", "Culture Score", "Retention",
  "Tech Stack Maturity", "Automation Rate", "Data Quality", "Security Posture", "Integration",
  "Gross Margin", "Net Margin", "EBITDA Margin", "Operating Cash Flow", "Free Cash Flow",
  "Current Ratio", "Quick Ratio", "Debt/EBITDA", "Interest Coverage", "Cash Runway",
  "Revenue Growth", "CAC", "LTV/CAC", "Payback Period",
];

const cards = [
  { label: "Formula", value: "f(x) = actual / benchmark × weight", color: colors.gold },
  { label: "Benchmark band", value: "Top quartile / median / threshold", color: colors.forest },
  { label: "Scoring band", value: "0-100 weighted partial score", color: colors.burnt },
];

export const Scene04Depth = () => {
  const frame = useCurrentFrame();
  const bloom = spring({ frame: frame - 10, fps: 30, config: { damping: 20, stiffness: 90 } });
  const title = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1200,
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
            fontFamily: "Fraunces, serif",
            fontSize: 56,
            fontWeight: 700,
            color: colors.ivory,
            lineHeight: 1.1,
          }}
        >
          54 metrics.
        </div>
        <div
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: 22,
            fontWeight: 500,
            color: colors.gold,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 16,
          }}
        >
          Each with its own scoring logic
        </div>
      </div>

      <div
        style={{
          width: 900,
          height: 900,
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 12,
          transform: `scale(${0.7 + bloom * 0.3}) rotateX(${10 - bloom * 10}deg)`,
          opacity: bloom,
        }}
      >
        {metrics.map((m, i) => {
          const delay = i * 1.5;
          const show = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(frame, [delay, delay + 12], [20, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
          const hue = [colors.gold, colors.burnt, colors.forest, colors.oxblood, colors.navyMid, colors.steel][i % 6];
          return (
            <div
              key={i}
              style={{
                background: `${hue}12`,
                border: `1px solid ${hue}50`,
                borderRadius: 4,
                padding: "10px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateY(${y}px)`,
                opacity: show,
              }}
            >
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: hue,
                  letterSpacing: "0.04em",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {m}
              </span>
            </div>
          );
        })}
      </div>

      {cards.map((card, i) => {
        const delay = 90 + i * 18;
        const show = interpolate(frame, [delay, delay + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(frame, [delay, delay + 20], [i % 2 === 0 ? -80 : 80, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 160 + i * 110,
              left: i % 2 === 0 ? 80 : undefined,
              right: i % 2 === 1 ? 80 : undefined,
              width: 360,
              padding: "22px 26px",
              background: `${card.color}12`,
              borderLeft: `4px solid ${card.color}`,
              borderRadius: 4,
              opacity: show,
              transform: `translateX(${x}px)`,
            }}
          >
            <div
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 13,
                fontWeight: 800,
                color: card.color,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: 24,
                fontWeight: 600,
                color: colors.ivory,
                marginTop: 8,
              }}
            >
              {card.value}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
