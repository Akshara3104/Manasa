// Manasa brand logo — bold rounded "MANASA" wordmark with smile curve + droplet
export default function BrandLogo({ className = 'h-10 w-auto', color = '#1E3A8A', showTagline = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 160"
      className={className}
      aria-label="Manasa"
    >
      <text
        x="240"
        y="98"
        textAnchor="middle"
        fontFamily="Fredoka, 'Baloo 2', 'Nunito', system-ui, sans-serif"
        fontWeight="700"
        fontSize="92"
        letterSpacing="2"
        fill={color}
      >
        MANASA
      </text>
      {/* smile curve */}
      <path
        d="M70 128 C 170 168, 320 168, 400 130"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* milk droplet at end of smile */}
      <path
        d="M405 116 C 415 126, 424 134, 424 142 C 424 152, 416 158, 408 158 C 400 158, 392 152, 392 142 C 392 134, 400 124, 405 116 Z"
        fill={color}
      />
      {showTagline && (
        <text
          x="240"
          y="150"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="14"
          letterSpacing="6"
          fill={color}
          opacity="0.7"
        >
          PURE • FRESH • TRUSTED
        </text>
      )}
    </svg>
  );
}
