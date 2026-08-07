import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGLINE: Record<string, string> = {
  en: "Math taught me to see problems as puzzles. Code taught me to solve them.",
  es: "Las matemáticas me enseñaron a ver los problemas como rompecabezas.",
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = TAGLINE[locale] ?? TAGLINE.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0b",
          color: "#e4e4e7",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            color: "#71717a",
            marginBottom: 28,
          }}
        >
          <span style={{ color: "#22d3ee", marginRight: 12 }}>{">"}</span>
          mauricio.dev
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Mauricio Rodríguez Carballo
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#a1a1aa",
            marginTop: 28,
            maxWidth: 920,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
