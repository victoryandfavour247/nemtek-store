export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const main = light ? "#ffffff" : "var(--navy)";
  const sub = light ? "rgba(255,255,255,.8)" : "var(--text-faint)";
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span className="relative grid h-9 w-9 place-items-center">
        <svg viewBox="0 0 48 48" className="h-9 w-9">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={light ? "#ffffff" : "#1e52e6"} />
              <stop offset="1" stopColor={light ? "#ffe9cf" : "#0b2a6b"} />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="22" fill={light ? "rgba(255,255,255,.18)" : "url(#lg)"} stroke={light ? "#fff" : "none"} strokeWidth={light ? 2 : 0} />
          {[0, 1, 2].map((r) => (
            <g key={r} transform={`translate(0 ${r * 8 - 4})`}>
              {[0, 1, 2, 3].map((c) => (
                <rect key={c} x={10 + c * 7} y={18} width={5} height={3} rx={1} fill="#fff" transform="skewX(-20)" opacity={0.95} />
              ))}
            </g>
          ))}
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[19px] font-black tracking-tight" style={{ color: main }}>NEMTEK</span>
          <span className="block text-[9.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: sub }}>Store · Ghana</span>
        </span>
      )}
    </span>
  );
}
