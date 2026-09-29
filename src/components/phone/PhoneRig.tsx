import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Phone3D } from "./Phone3D";

type Props = {
  children?: ReactNode;
  /** Positions the device (the sizer is centred on its own anchor point). */
  className?: string;
  /** Class for the element GSAP animates. */
  rigClassName?: string;
  style?: CSSProperties;
  /** Idle floating motion. */
  float?: boolean;
  /** Soft blue light behind the device. */
  backlight?: boolean;
  label?: string;
};

/**
 * sizer (responsive scale) > camera (perspective) > rig (animated) > float > phone.
 * Set `--phone-s` on the sizer (via className or style) to size the device.
 */
export function PhoneRig({ children, className, rigClassName, style, float = true, backlight = false, label }: Props) {
  return (
    <div className={cn("pp-sizer", className)} style={style}>
      <div className="pp-persp">
        <div className={cn("pp-rig", rigClassName)}>
          <div className={cn("pp-float", float && "is-floating")}>
            {backlight && <div className="pp-backlight" aria-hidden />}
            <Phone3D label={label}>{children}</Phone3D>
          </div>
        </div>
      </div>
    </div>
  );
}
