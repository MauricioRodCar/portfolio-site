import { trafficOptimization } from "./traffic-optimization";
import { devopsPipeline } from "./devops-pipeline";
import { aiAgent } from "./ai-agent";
import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [trafficOptimization, devopsPipeline, aiAgent];
export type { CaseStudy };
