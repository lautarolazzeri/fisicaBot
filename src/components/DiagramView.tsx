export function DiagramView({ data }: any) {
  const arrowTargets: Record<
    string,
    { x2: number; y2: number; labelX: number; labelY: number }
  > = {
    up: { x2: 150, y2: 30, labelX: 160, labelY: 25 },
    down: { x2: 150, y2: 210, labelX: 160, labelY: 215 },
    left: { x2: 40, y2: 120, labelX: 5, labelY: 115 },
    right: { x2: 260, y2: 120, labelX: 265, labelY: 115 },
  };

  return (
    <div className="flex flex-wrap gap-6 my-4">
      {data.bodies?.map((body: any, index: number) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <span className="text-xs text-zinc-400 font-semibold">
            {body.body}
          </span>
          <svg width="300" height="240" style={{ background: "transparent" }}>
            <defs>
              <marker
                id={`arrow-${index}`}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill="white" />
              </marker>
            </defs>

            {/* Cuerpo central */}
            <rect
              x="115"
              y="90"
              width="70"
              height="60"
              rx="4"
              fill="#3b82f6"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />

            {body.forces.map((force: any, i: number) => {
              const target = arrowTargets[force.direction];
              if (!target) return null;
              return (
                <g key={i}>
                  <line
                    x1="150"
                    y1="120"
                    x2={target.x2}
                    y2={target.y2}
                    stroke="white"
                    strokeWidth="2.5"
                    markerEnd={`url(#arrow-${index})`}
                  />
                  {/* Símbolo en negrita */}
                  <text
                    x={target.labelX}
                    y={target.labelY}
                    fill="#facc15"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor={force.direction === "left" ? "end" : "start"}
                  >
                    {force.symbol}
                  </text>
                  {/* Nombre debajo del símbolo */}
                  <text
                    x={target.labelX}
                    y={target.labelY + 13}
                    fill="#a1a1aa"
                    fontSize="10"
                    fontFamily="sans-serif"
                    textAnchor={force.direction === "left" ? "end" : "start"}
                  >
                    {force.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ))}
    </div>
  );
}
