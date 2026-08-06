import type { HTMLAttributes } from "react";

export function Tag({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-xs text-muted ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
