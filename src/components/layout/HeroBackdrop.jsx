const traces = [
  'M40 140 H190 L232 182 H394 L438 138 H620',
  'M92 330 H256 L312 274 H516 L570 326 H770',
  'M172 560 H356 L410 508 H602 L662 566 H990',
  'M682 90 H910 L954 132 H1130',
  'M610 214 H748 L796 166 H1052',
  'M724 420 H870 L922 368 H1160',
  'M540 640 H732 L778 594 H1056',
];

const verticalTraces = [
  'M316 72 V186 L260 242 V398',
  'M478 96 V236 L532 290 V486',
  'M702 60 V184 L760 242 V430',
  'M924 122 V276 L866 334 V616',
  'M1082 178 V338 L1024 396 V676',
];

const nodes = [
  [190, 140],
  [232, 182],
  [394, 182],
  [570, 326],
  [770, 326],
  [356, 560],
  [662, 566],
  [910, 90],
  [1052, 166],
  [922, 368],
  [778, 594],
  [1024, 396],
];

const dataBars = [
  [760, 210, 76],
  [864, 184, 132],
  [968, 236, 96],
  [1072, 160, 170],
];

export default function HeroBackdrop() {
  return (
      <div aria-hidden="true" className="hero-tech-backdrop">
      <div className="hero-tech-grid" />
      <div className="hero-tech-scan" />
      <svg
        className="hero-tech-circuit"
        viewBox="0 0 1200 760"
        preserveAspectRatio="xMidYMid slice"
        role="img"
      >
        <defs>
          <linearGradient id="traceGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="36%" stopColor="#22d3ee" stopOpacity="0.72" />
            <stop offset="72%" stopColor="#a78bfa" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#34d396" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="panelGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#0f2742" stopOpacity="0.8" />
            <stop offset="58%" stopColor="#12203d" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#0b1020" stopOpacity="0.18" />
          </linearGradient>
          <filter id="traceGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.16
                      0 0 0 0 0.72
                      0 0 0 0 1
                      0 0 0 0.58 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="hero-tech-panel">
          <path d="M520 56 H1160 L1114 704 H420 Z" fill="url(#panelGradient)" />
          <path d="M608 96 H1104 L1072 660 H500 Z" />
          <path d="M684 144 H1036 L1014 612 H592 Z" />
        </g>

        <g filter="url(#traceGlow)">
          {traces.map((trace) => (
            <path key={trace} className="hero-tech-trace" d={trace} />
          ))}
          {verticalTraces.map((trace) => (
            <path key={trace} className="hero-tech-trace hero-tech-trace-soft" d={trace} />
          ))}
        </g>

        <g className="hero-tech-data">
          {dataBars.map(([x, y, height]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="34" height={height} rx="4" />
          ))}
          <path d="M730 470 H1110" />
          <path d="M760 512 H1068" />
          <path d="M792 554 H1126" />
        </g>

        <g className="hero-tech-nodes">
          {nodes.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
          ))}
        </g>
      </svg>
      <div className="hero-tech-shield" />
    </div>
  );
}
