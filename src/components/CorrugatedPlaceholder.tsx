/**
 * Placeholder illustration for the "Built for corrugated" section — a clean stack of
 * corrugated cartons with a printed rainbow band, so it clearly reads as printed
 * packaging (the previous photo read as a wooden stack).
 *
 * On-palette only: neutrals (white-alpha on the dark section) plus the existing ink
 * rainbow for the printed strip. Self-contained inline SVG, fills its container.
 *
 * TODO: client to supply a real photo of boxes / paper bags / printed products;
 * swap this component for an <img> once the asset arrives.
 */
export function CorrugatedPlaceholder({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Illustration of printed corrugated cartons (placeholder)"
    >
      <defs>
        <linearGradient id="cp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1b22" />
          <stop offset="1" stopColor="#0f0f14" />
        </linearGradient>
        <linearGradient id="cp-print" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f51d31" />
          <stop offset="0.16" stopColor="#fb7c00" />
          <stop offset="0.32" stopColor="#f1cb1c" />
          <stop offset="0.48" stopColor="#33b544" />
          <stop offset="0.64" stopColor="#00bbd5" />
          <stop offset="0.8" stopColor="#0766ee" />
          <stop offset="1" stopColor="#7d24d3" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="url(#cp-bg)" />

      {/* Back carton (peeking behind) */}
      <g stroke="#ffffff" strokeOpacity="0.28" strokeWidth="3" strokeLinejoin="round">
        <polygon points="120,250 250,190 470,190 340,250" fill="#ffffff" fillOpacity="0.10" />
        <polygon points="120,250 340,250 340,470 120,470" fill="#ffffff" fillOpacity="0.06" />
        <polygon points="340,250 470,190 470,410 340,470" fill="#ffffff" fillOpacity="0.03" />
      </g>

      {/* Front carton */}
      <g stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3.5" strokeLinejoin="round">
        {/* top flaps */}
        <polygon points="300,300 430,240 700,240 570,300" fill="#ffffff" fillOpacity="0.16" />
        {/* right side */}
        <polygon points="570,300 700,240 700,470 570,530" fill="#ffffff" fillOpacity="0.07" />
        {/* front face */}
        <polygon points="300,300 570,300 570,530 300,530" fill="#ffffff" fillOpacity="0.12" />
        {/* centre seam + tape */}
        <line x1="435" y1="300" x2="435" y2="530" strokeOpacity="0.3" />
        <line x1="300" y1="318" x2="570" y2="318" strokeOpacity="0.3" />
      </g>

      {/* Printed rainbow band on the front face (the "printed inks" nod) */}
      <g>
        <rect x="318" y="372" width="234" height="70" rx="6" fill="url(#cp-print)" opacity="0.92" />
        <rect x="318" y="372" width="234" height="70" rx="6" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" />
      </g>

      {/* Flute detail on the top-front cut edge */}
      <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2">
        {Array.from({ length: 19 }).map((_, i) => {
          const x = 306 + i * 14;
          return <line key={x} x1={x} y1="300" x2={x} y2="312" />;
        })}
      </g>
    </svg>
  );
}
