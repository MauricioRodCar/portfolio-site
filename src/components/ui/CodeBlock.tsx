import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  lang: string;
  filename?: string;
}

export async function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark-high-contrast",
  });

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {filename && (
        <div className="border-b border-border bg-foreground/[0.03] px-4 py-2 font-mono text-xs text-muted">
          {filename}
        </div>
      )}
      <div
        className="overflow-x-auto text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
