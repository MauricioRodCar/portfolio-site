import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-border bg-foreground/[0.03] p-6 transition-colors hover:border-accent/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
