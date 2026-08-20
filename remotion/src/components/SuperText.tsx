import { useCurrentFrame } from "remotion";
import { useSpringEnter } from "../lib/animations";
import { colors } from "../lib/colors";

export const SuperText = ({
  children,
  delay = 0,
  style = {},
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const frame = useCurrentFrame();
  const enter = useSpringEnter(delay, { damping: 15, stiffness: 180 });
  const y = (1 - enter) * 60;
  const opacity = enter;
  const blur = (1 - enter) * 12;

  return (
    <div
      className={className}
      style={{
        transform: `translateY(${y}px)`,
        opacity,
        filter: `blur(${blur}px)`,
        color: colors.ivory,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
