import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { Maze } from "@/components/sections/Maze";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Playground } from "@/components/sections/Playground";
import { Stack } from "@/components/sections/Stack";
import { Audit } from "@/components/sections/Audit";
import { Contact } from "@/components/sections/Contact";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main id="main-content" className="flex flex-1 flex-col">
        <Hero />
        <Maze />
        <CaseStudies />
        <Playground />
        <Stack />
        <Audit />
        <Contact />
      </main>
    </>
  );
}
