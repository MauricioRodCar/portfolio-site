export interface StackGroup {
  key: string;
  tools: readonly string[];
}

// Primary tier: what Mauricio reaches for by default. Grounded in his
// resume (see TODO.md Stack section redesign entry) rather than the
// brief's original placeholder tech.
export const primaryGroups: StackGroup[] = [
  {
    key: "iterationSpeed",
    tools: ["React", "TypeScript", "Styled Components"],
  },
  {
    key: "projectGrows",
    tools: ["Node.js", "Express", "NestJS", "MongoDB"],
  },
];

// Secondary tier: also shipped production code with these, per his CV's
// own "SUGGESTED TECH STACK" list plus verified experience-bullet tech —
// not the default reach, but available if a project needs them.
export const secondaryGroups: StackGroup[] = [
  {
    key: "frontend",
    tools: [
      "JavaScript",
      "HTML",
      "CSS",
      "Sass/Less/Scss",
      "jQuery",
      "Angular",
      "Redux",
      "GraphQL",
    ],
  },
  {
    key: "backend",
    tools: ["PHP", "WordPress", "Wagtail", "Python", "Java", "SQL"],
  },
  {
    key: "cloud",
    tools: ["Git", "GitHub", "GitLab", "Bitbucket", "AWS", "GCP", "PM2", "Keycloak"],
  },
  {
    key: "tooling",
    tools: ["Webpack", "npm", "Jest", "Enzyme", "React Testing Library", "SEO"],
  },
];
