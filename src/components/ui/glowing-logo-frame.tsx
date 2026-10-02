import { cn } from "@/lib/utils";

interface GlowingLogoFrameProps {
  src: string;
  alt?: string;
  className?: string;
}

/**
 * Static rounded frame with the logo always visible.
 * Only the thin border glow rotates around the edges.
 */
export const GlowingLogoFrame = ({ src, alt = "", className }: GlowingLogoFrameProps) => {
  return (
    <div className={cn("relative inline-block rounded-2xl", className)}>
      {/* Soft static outer halo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-3xl blur-xl opacity-50 -z-10"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.5), transparent 70%)",
        }}
      />

      {/* Animated thin border using gradient mask trick */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl p-[1.5px] animate-[rotate_4s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary)) 60deg, hsl(0 100% 75%) 90deg, hsl(var(--primary)) 120deg, transparent 180deg, transparent 360deg)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Static logo content */}
      <div className="relative rounded-2xl bg-background px-5 py-3">
        <img src={src} alt={alt} className="h-12 sm:h-14 w-auto block" />
      </div>
    </div>
  );
};
