// Shared wheel renderer for all variants — pure SVG, no rotation animation
// here (the HTML prototype keeps things static). Accepts a `variant` prop to
// subtly restyle segments between editorial looks while keeping geometry
// identical across all three directions.

const PRIZES = [
  { key: 'creator_40',   num: 1,  label: '40%', sub: 'Creator',   color: '#1f0e47', fg: '#faf7ff', tier: 'jackpot' },
  { key: 'ultimate_40',  num: 2,  label: '40%', sub: 'Ultimate',  color: '#2a1263', fg: '#faf7ff', tier: 'jackpot' },
  { key: 'standard_40',  num: 3,  label: '40%', sub: 'Standard',  color: '#371a7f', fg: '#faf7ff', tier: 'jackpot' },
  { key: 'creator_20',   num: 4,  label: '20%', sub: 'Creator',   color: '#4d25ab', fg: '#faf7ff', tier: 'hi' },
  { key: 'creator_10',   num: 5,  label: '10%', sub: 'Creator',   color: '#6a3fcb', fg: '#faf7ff', tier: 'hi' },
  { key: 'ultimate_25',  num: 6,  label: '25%', sub: 'Ultimate',  color: '#7c3aed', fg: '#faf7ff', tier: 'hi' },
  { key: 'ultimate_15',  num: 7,  label: '15%', sub: 'Ultimate',  color: '#8b5cf6', fg: '#faf7ff', tier: 'mid' },
  { key: 'standard_30',  num: 8,  label: '30%', sub: 'Standard',  color: '#a78bfa', fg: '#1f0e47', tier: 'mid' },
  { key: 'standard_25',  num: 9,  label: '25%', sub: 'Standard',  color: '#c4b5fd', fg: '#1f0e47', tier: 'lo' },
  { key: 'standard_20',  num: 10, label: '20%', sub: 'Standard',  color: '#d8c7ff', fg: '#1f0e47', tier: 'lo' },
  { key: 'credits_5k',   num: 11, label: '5K',  sub: 'Credits',   color: '#fff4d6', fg: '#1f0e47', tier: 'credits' },
  { key: 'credits_10k',  num: 12, label: '10K', sub: 'Credits',   color: '#ffe6a3', fg: '#1f0e47', tier: 'credits' },
  { key: 'credits_15k',  num: 13, label: '15K', sub: 'Credits',   color: '#ffd770', fg: '#1f0e47', tier: 'credits' },
  { key: 'credits_20k',  num: 14, label: '20K', sub: 'Credits',   color: '#f5b941', fg: '#1f0e47', tier: 'credits' },
  { key: 'credits_25k',  num: 15, label: '25K', sub: 'Credits',   color: '#e09a1a', fg: '#faf7ff', tier: 'credits' },
];

const SEG = 360 / PRIZES.length; // 24deg

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function segPath(cx, cy, r, a, b) {
  const s = polar(cx, cy, r, b), e = polar(cx, cy, r, a);
  const large = b - a <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} Z`;
}

function Wheel({ size = 300, rotation = -12, variant = 'aurora', dim = false }) {
  const r = size / 2;
  const cx = r, cy = r;
  const outer = r - 6;
  const numR = outer * 0.75;
  const badgeR = size < 260 ? 10 : 12;

  return (
    <div style={{ position: 'relative', width: size, height: size, userSelect: 'none' }}>
      {/* aura */}
      <div aria-hidden style={{
        position: 'absolute', inset: -28, borderRadius: '50%',
        background: variant === 'editorial'
          ? 'radial-gradient(circle, rgba(167,139,250,0.22), transparent 70%)'
          : 'conic-gradient(from 0deg, rgba(167,139,250,0.5), rgba(196,181,253,0.4), rgba(124,58,237,0.5), rgba(167,139,250,0.5))',
        filter: 'blur(32px)', opacity: variant === 'editorial' ? 0.6 : 0.8,
      }} />

      {/* pointer */}
      <div style={{ position: 'absolute', left: '50%', top: -10, transform: 'translateX(-50%)', zIndex: 3 }}>
        <svg width="36" height="44" viewBox="0 0 36 44">
          <defs>
            <linearGradient id={`pin-${variant}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#1f0e47" />
            </linearGradient>
          </defs>
          <path d="M18 42 L3 12 A16 16 0 0 1 33 12 Z" fill={`url(#pin-${variant})`} stroke="#faf7ff" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="18" cy="14" r="4" fill="#faf7ff" />
        </svg>
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: `rotate(${rotation}deg)`, transition: 'transform .6s cubic-bezier(.12,.7,.1,1)', filter: dim ? 'saturate(0.5) brightness(0.65)' : 'none' }}>
        <defs>
          <radialGradient id={`rim-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#1f0e47" />
            <stop offset="100%" stopColor="#4d25ab" />
          </radialGradient>
          <radialGradient id={`hub-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="60%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#1f0e47" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={outer + 6} fill={`url(#rim-${variant})`} />
        <circle cx={cx} cy={cy} r={outer + 3} fill={variant === 'editorial' ? '#f4eefe' : '#faf7ff'} />

        {PRIZES.map((p, i) => {
          const a = i * SEG, b = (i + 1) * SEG;
          return (
            <path key={p.key} d={segPath(cx, cy, outer, a, b)} fill={p.color}
              stroke={variant === 'editorial' ? '#f4eefe' : '#faf7ff'} strokeWidth="1" />
          );
        })}

        {PRIZES.map((p, i) => {
          const mid = i * SEG + SEG / 2;
          const pos = polar(cx, cy, numR, mid);
          const isDark = p.fg === '#faf7ff';
          const bg = isDark ? '#faf7ff' : '#1f0e47';
          const fg = isDark ? '#1f0e47' : '#faf7ff';
          return (
            <g key={`n-${p.key}`}>
              <circle cx={pos.x} cy={pos.y} r={badgeR} fill={bg} stroke={fg} strokeWidth="1.25" />
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
                fontFamily="'Space Grotesk', system-ui, sans-serif"
                fontWeight={700} fontSize={size < 260 ? 10 : 12} fill={fg}
                transform={`rotate(${-rotation} ${pos.x} ${pos.y})`}>{p.num}</text>
            </g>
          );
        })}

        {/* hub */}
        <circle cx={cx} cy={cy} r={outer * 0.17} fill="#faf7ff" stroke="#1f0e47" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={outer * 0.125} fill={`url(#hub-${variant})`} />
        <path d={`M ${cx} ${cy - outer * 0.09}
                 L ${cx + outer * 0.022} ${cy - outer * 0.022}
                 L ${cx + outer * 0.09} ${cy}
                 L ${cx + outer * 0.022} ${cy + outer * 0.022}
                 L ${cx} ${cy + outer * 0.09}
                 L ${cx - outer * 0.022} ${cy + outer * 0.022}
                 L ${cx - outer * 0.09} ${cy}
                 L ${cx - outer * 0.022} ${cy - outer * 0.022} Z`}
          fill="#faf7ff" opacity={0.95} transform={`rotate(${-rotation} ${cx} ${cy})`} />
      </svg>
    </div>
  );
}

Object.assign(window, { Wheel, PRIZES });
