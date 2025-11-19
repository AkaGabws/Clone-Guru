import React from "react";

export function ProgressBar({ progress = 0, size = 20, strokeWidth = 3.9 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

    const getcolor = (value: number) => {
        if (value < 25) return"#FF0000";
        if (value < 50) return"#F59E0B";
        if (value < 90) return"#10B981";
        return "#009485";
    };

    const color = getcolor(progress);


  return (
    <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
        />
        <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
        />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            {progress}%
        </div>
    </div>
  );
}