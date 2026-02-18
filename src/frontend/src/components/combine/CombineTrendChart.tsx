import { useMemo } from 'react';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface CombineTrendChartProps {
  data: DataPoint[];
  label: string;
  unit: string;
  lowerIsBetter?: boolean;
}

export default function CombineTrendChart({ data, label, unit, lowerIsBetter }: CombineTrendChartProps) {
  const { chartData, minValue, maxValue, width, height } = useMemo(() => {
    if (data.length === 0) return { chartData: [], minValue: 0, maxValue: 0, width: 600, height: 200 };

    const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const values = sorted.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1;

    return {
      chartData: sorted,
      minValue: min - padding,
      maxValue: max + padding,
      width: 600,
      height: 200,
    };
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted/30 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = chartData.map((point, index) => {
    const x = padding + (index / (chartData.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, value: point.value };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const trend = chartData.length > 1 ? chartData[chartData.length - 1].value - chartData[0].value : 0;
  const isImproving = lowerIsBetter ? trend < 0 : trend > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        {chartData.length > 1 && (
          <span className={`text-xs ${isImproving ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
            {isImproving ? '↑ Improving' : '→ Stable'}
          </span>
        )}
      </div>
      <svg width={width} height={height} className="bg-muted/30 rounded-lg border border-border">
        <path d={pathD} fill="none" stroke="oklch(var(--primary))" strokeWidth="2" />
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="4" fill="oklch(var(--primary))" />
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              className="text-xs fill-foreground"
              style={{ fontSize: '10px' }}
            >
              {point.value.toFixed(2)}
            </text>
          </g>
        ))}
        <text x={padding} y={height - 10} className="text-xs fill-muted-foreground" style={{ fontSize: '10px' }}>
          Oldest
        </text>
        <text
          x={width - padding}
          y={height - 10}
          textAnchor="end"
          className="text-xs fill-muted-foreground"
          style={{ fontSize: '10px' }}
        >
          Latest
        </text>
      </svg>
    </div>
  );
}
