import { Button } from "@/components/ui/Button";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-sm text-foreground">
          <span className="text-accent">&gt;</span> mauricio.dev
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#work"
            className="font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent"
          >
            How I Think
          </a>
          <a
            href="#stack"
            className="font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent"
          >
            Stack
          </a>
          <Button href="#contact" variant="outline" className="px-3 py-1.5">
            Contact
          </Button>
        </div>
      </nav>
    </header>
  );
}
