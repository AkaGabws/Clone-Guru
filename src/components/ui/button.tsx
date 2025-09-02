import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon" | "lg";
  className?: string;
};

export function Button({ children, className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-200 hover:bg-slate-50",
    ghost: "hover:bg-slate-100",
  };
  const sizes: Record<string, string> = {
    default: "h-9 px-4",
    icon: "h-9 w-9",
    lg: "h-11 px-6",
  };
  const v = variants[variant] ?? variants.default;
  const s = sizes[size] ?? sizes.default;
  return (
    <button className={`${base} ${v} ${s} ${className}`} {...props}>
      {children}
    </button>
  );
}




