import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const EMAIL = "contact.mauricio.rodriguez@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/mauricio-rodriguez-carballo";
const RESUME_URL = "/MauricioRodriguez_Resume.pdf";

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24 text-center"
    >
      <Reveal>
        <h2 className="font-mono text-sm uppercase tracking-wide text-accent">
          Contact
        </h2>
        <p className="mx-auto mt-4 max-w-md text-foreground">
          The fastest way to reach me is email or LinkedIn.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href={`mailto:${EMAIL}`}>Email</Button>
          <Button
            href={LINKEDIN_URL}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </Button>
          <Button
            href={RESUME_URL}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume (PDF)
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
