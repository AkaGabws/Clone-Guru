import React from "react";

type BadgeProps = {
  className?: string;
  children?: React.ReactNode;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}


