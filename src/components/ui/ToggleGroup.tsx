"use client";

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
  ariaLabel: string;
  className?: string;
}

export function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}: ToggleGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex rounded-md border border-border p-0.5 font-mono text-xs uppercase tracking-wide ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            value === option.value
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-accent"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
