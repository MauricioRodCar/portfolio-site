import type { CaseStudy } from "./types";

export const devopsPipeline: CaseStudy = {
  slug: "devops-pipeline",
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
