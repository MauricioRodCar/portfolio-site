import type { CaseStudy } from "./types";

export const devopsPipeline: CaseStudy = {
  slug: "devops-pipeline",
  title: "Multi-repo / DevOps",
  context:
    "A small engineering team was shipping to both a QA and a production environment, with deploys handled by hand — meaning the only thing standing between a broken branch and production was whoever remembered to run the checks that day.",
  decision:
    "A CI/CD pipeline with quality gates (lint, test, build) that every branch must clear, where QA deploys automatically off develop and production only ships from main behind a required-reviewer environment.",
  proseIntro:
    "This isn't feature code — it's process design. The job here wasn't writing a clever function, it was making sure the whole team could ship without anyone having to remember to be careful.",
  lang: "yaml",
  filename: ".github/workflows/deploy.yml",
  tags: ["CI/CD", "GitHub Actions", "DevOps", "Node.js", "PM2"],
  code: `
name: CI/CD

on:
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/

  deploy-qa:
    # develop merges go straight to QA. This environment exists to break —
    # the gate is "did it build," not "did a human sign off."
    if: github.ref == 'refs/heads/develop'
    needs: build
    runs-on: ubuntu-latest
    environment: qa
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
      - run: ./scripts/deploy.sh qa # pm2 reload on the QA host

  deploy-production:
    # Production only ships from main, and only behind a required reviewer
    # on the "production" GitHub environment — one bad merge shouldn't be
    # able to reach real users without a second set of eyes.
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
      - run: ./scripts/deploy.sh production # pm2 reload on the prod host
`.trim(),
};
