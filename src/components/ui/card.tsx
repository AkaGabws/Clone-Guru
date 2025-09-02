import React from "react";

type WithClassName = {
  className?: string;
  children?: React.ReactNode;
};

export function Card({ className = "", children }: WithClassName) {
  return <div className={`rounded-xl border bg-white ${className}`}>{children}</div>;
}

export function CardHeader({ className = "", children }: WithClassName) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardContent({ className = "", children }: WithClassName) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: WithClassName) {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ className = "", children }: WithClassName) {
  return <p className={`text-slate-600 text-sm ${className}`}>{children}</p>;
}


