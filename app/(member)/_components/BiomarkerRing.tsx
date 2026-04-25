type BiomarkerRingProps = {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  size?: number;
};

export default function BiomarkerRing({
  label,
  value,
  unit,
  min,
  max,
  size = 140,
}: BiomarkerRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const fill = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const offset = circumference * (1 - fill);
  const center = size / 2;
  const filterId = `glow-${label.replace(/\s+/g, "")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(201, 169, 97, 0.15)"
          strokeWidth="4"
        />

        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#c9a961"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          filter={`url(#${filterId})`}
        />

        {/* Value */}
        <text
          x={center}
          y={center - 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#f5eadd"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="28"
          fontWeight="600"
        >
          {value}
        </text>

        {/* Unit */}
        <text
          x={center}
          y={center + 18}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(245, 234, 221, 0.5)"
          fontFamily="'Didact Gothic', sans-serif"
          fontSize="10"
        >
          {unit}
        </text>
      </svg>

      <div
        style={{
          fontSize: "9px",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "#f5eadd",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
}
