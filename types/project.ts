export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
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
