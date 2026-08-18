import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * FlipTile — a click/keyboard operated card that turns in place to reveal a
 * second face. The scene keeps a fixed height so the surrounding grid never
 * reflows. Reduced motion collapses the turn to a crossfade.
 */
export function FlipTile({
  front,
  back,
  className,
  label,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <div className={cn("flip-scene relative", className)}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        animate={reduce ? {} : { rotateY: open ? 180 : 0 }}
        transition={{ duration: 0.75, ease }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div
          className={cn(
            "flip-face h-full w-full transition-opacity",
            reduce && open && "pointer-events-none opacity-0",
          )}
        >
          {front}
        </div>
        <div
          id={id}
          className={cn(
            "flip-face absolute inset-0 h-full w-full",
            reduce ? (open ? "opacity-100" : "pointer-events-none opacity-0") : undefined,
          )}
          style={reduce ? undefined : { transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
