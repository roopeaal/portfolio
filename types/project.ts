export interface Project {
  slug: string;
  title: string;
  shortTitle?: string;
  category: string;
  summary: string;
  overview?: string[];
  whatIDid?: string[];
  technicalHighlights?: string[];
  skillsDemonstrated?: string[];
  recruiterKeywords?: string[];
  employerPoints?: string[];
  objective: string;
  technicalScope: string;
  environment: string;
  implementation: string;
  validation: string;
  result: string;
  learned: string;
  stack: string[];
  evidence: string[];
  cardAccent?: "router" | "switch" | "pc" | "phone";
}
