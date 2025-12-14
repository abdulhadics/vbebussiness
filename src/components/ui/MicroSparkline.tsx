'use client';

interface MicroSparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
}

export function MicroSparkline({
    data,
    width = 60,
    height = 20,
    color = '#10b981'
}: MicroSparklineProps) {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const isPositive = data[data.length - 1] >= data[0];

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`sparkGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Area fill */}
            <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill={`url(#sparkGrad-${color})`}
            />

            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* End dot */}
            <circle
                cx={width}
                cy={height - ((data[data.length - 1] - min) / range) * height}
                r="2"
                fill={isPositive ? '#10b981' : '#ef4444'}
            />
        </svg>
    );
}
