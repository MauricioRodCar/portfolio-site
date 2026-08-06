import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Stack } from "@/components/sections/Stack";
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
      <Hero />
      <CaseStudies />
      <Stack />
      <Contact />
    </>
  );
}
