import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent/90",
  outline:
    "border border-border text-foreground hover:border-accent hover:text-accent",
};

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
