import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Stack } from "@/components/sections/Stack";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
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
