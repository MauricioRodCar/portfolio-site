export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
      <p className="font-mono text-sm text-muted">
        <span className="text-accent">$</span> deploy --status
      </p>
      <h1 className="font-mono text-lg text-foreground">
        Portfolio pipeline online. Content coming in Phase 1.
      </h1>
    </main>
  );
}
