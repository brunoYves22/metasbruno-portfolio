import { cn } from "@/lib/utils";

interface TopLightProps {
  className?: string;
}

/**
 * Subtle ceiling spotlight at the top of the page.
 */
export const TopLight = ({ className }: TopLightProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0 h-[340px] overflow-hidden",
        className
      )}
    >
      {/* Thin source line */}
      <div className="absolute top-0 left-1/2 h-px w-[35%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Soft halo right under the source */}
      <div className="absolute top-0 left-1/2 h-24 w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-2xl" />

      {/* Trapezoidal light cone */}
      <div
        className="absolute top-0 left-1/2 h-[340px] w-[70%] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0) 100%)",
          clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
          filter: "blur(24px)",
        }}
      />
    </div>
  );
};
