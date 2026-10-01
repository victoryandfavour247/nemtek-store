export default function StarRating({
  value,
  size = 14,
  showNumber = false,
}: {
  value: number;
  size?: number;
  showNumber?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1" title={`${value} out of 5`}>
      <span className="inline-flex" style={{ color: "var(--amber)" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`s${i}-${value}`}>
                  <stop offset={`${fill * 100}%`} stopColor="var(--amber)" />
                  <stop offset={`${fill * 100}%`} stopColor="var(--border)" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"
                fill={`url(#s${i}-${value})`}
              />
            </svg>
          );
        })}
      </span>
      {showNumber && (
        <span className="text-sm font-semibold" style={{ color: "var(--text-soft)" }}>
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}
