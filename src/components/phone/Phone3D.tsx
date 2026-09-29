import { memo, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BUTTON_STYLES, FACET_STYLES } from "./geometry";

type Props = {
  children?: ReactNode;
  className?: string;
  label?: string;
};

/**
 * A modern smartphone built from CSS 3D planes: back glass with camera island,
 * an extruded titanium edge, and a front glass face whose screen hosts live DOM.
 * The same device is used in every scene so proportions and lighting match.
 */
export const Phone3D = memo(function Phone3D({ children, className, label = "Pocket PEC app on a smartphone" }: Props) {
  return (
    <div className={cn("pp-phone", className)} role="img" aria-label={label}>
      <div className="pp-face pp-back" aria-hidden>
        <div className="pp-camera">
          <span className="pp-lens" style={{ left: 14, top: 14 }} />
          <span className="pp-lens" style={{ left: 14, top: 72 }} />
          <span className="pp-lens" style={{ left: 72, top: 43 }} />
          <span className="pp-flash" style={{ left: 88, top: 16 }} />
        </div>
      </div>

      {FACET_STYLES.map((style, i) => (
        <div key={i} className="pp-facet" style={style} aria-hidden />
      ))}
      {BUTTON_STYLES.map((style, i) => (
        <div key={`b${i}`} className="pp-btn" style={style} aria-hidden />
      ))}

      <div className="pp-face pp-front">
        <div className="pp-screen">
          {children}
          <div className="pp-screen-off" aria-hidden />
        </div>
        <div className="pp-punch" aria-hidden />
        <div className="pp-glare" aria-hidden />
      </div>
    </div>
  );
});
