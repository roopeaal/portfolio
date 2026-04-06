import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "multi-platform-iot-security-lab",
    title: "Multi-Platform IoT Security Lab",
    category: "Networks & Security",
    summary:
      "Comparative lab work built to test how different platforms support connected-system simulation, segmentation, visibility and repeatable security validation.",
    objective:
      "Create one consistent security scenario across multiple lab platforms instead of treating each tool as a separate demo.",
    technicalScope:
      "IoT-style endpoint simulation, segmented network design, baseline connectivity validation, traffic isolation, platform comparison and practical trade-off analysis.",
    environment:
      "CML Free, GNS3, EVE-NG and Containerlab, with Linux-based testing workflows and screenshot-backed documentation.",
    implementation:
      "I built comparable topologies, verified baseline communication, introduced segmentation, repeated discovery and attack-style validation steps, and documented how each platform changes the speed, realism and repeatability of the work.",
    validation:
      "Validated through before/after connectivity checks, blocked-path verification, screenshots, stepwise notes and comparison of what changed across platforms.",
    result:
      "The outcome was a more credible platform comparison and a stronger foundation for future infrastructure and security-focused labs.",
    learned:
      "The best lab platform is not the one with the biggest feature list. It is the one that gives enough control and repeatability for the engineering question you are trying to answer.",
    stack: ["CML", "GNS3", "EVE-NG", "Containerlab", "Linux", "Networking"],
    evidence: [
      "Comparable topologies built on multiple platforms",
      "Segmentation and blocked-path validation documented step by step",
      "Platform strengths and trade-offs written as engineering notes instead of tool fan talk",
    ],
    cardAccent: "switch",
  },
  {
    slug: "linux-server-and-database-environment",
    title: "Linux Server and Database Environment",
    category: "Linux Infrastructure",
    summary:
      "Hands-on server-side lab work focused on Linux administration, service handling, command-line discipline and repeatable environment setup.",
    objective:
      "Strengthen infrastructure fundamentals through real Linux-first tasks instead of treating administration as theory.",
    technicalScope:
      "Command-line workflow, package management, permissions, service control, basic database setup, troubleshooting and configuration repeatability.",
    environment:
      "Linux server environments, shell-based workflows, system services and database fundamentals in course and lab context.",
    implementation:
      "I configured services, worked through CLI-based administration tasks, handled permissions and environment-level troubleshooting, and documented the setup steps so the environment could be repeated later.",
    validation:
      "Validated with service status checks, configuration verification, command-line testing and ability to explain what each change affected.",
    result:
      "This strengthened Linux as a real implementation environment for me instead of remaining a purely academic topic.",
    learned:
      "Even basic Linux work becomes more credible when changes are documented, verified and treated as operational work instead of one-off trial and error.",
    stack: ["Linux", "CLI", "Services", "Databases", "Validation"],
    evidence: [
      "Service-level checks used to verify configuration changes",
      "Commands and setup flow documented for repeatability",
      "Focus stayed on explainable system behavior, not just final screenshots",
    ],
    cardAccent: "pc",
  },
  {
    slug: "segmented-enterprise-network-lab",
    title: "Segmented Enterprise Network Lab",
    category: "Networking",
    summary:
      "Lab work around switching, routing, VLAN thinking and enterprise network structure with attention to what configuration changes actually do.",
    objective:
      "Build a stronger practical understanding of segmentation, routing paths and enterprise-style network behavior.",
    technicalScope:
      "Switching, routing, VLANs, addressing, enterprise network basics, secure design thinking and configuration discipline.",
    environment:
      "Packet Tracer-style networking labs and structured configuration exercises tied to course work.",
    implementation:
      "I configured topology components step by step, verified traffic paths, adjusted segmentation and documented why the network behaved the way it did instead of stopping at the first working state.",
    validation:
      "Validated through connectivity checks, route and segmentation verification, configuration review and written reasoning about expected behavior.",
    result:
      "The result is a more solid base for trainee and junior work where network basics, careful configuration and practical reasoning matter.",
    learned:
      "Networking work becomes believable when you can explain topology, verify behavior and document implementation choices clearly, not just say the lab worked.",
    stack: ["VLAN", "Routing", "Switching", "Topology", "Validation"],
    evidence: [
      "Segmented topology behavior checked through connectivity tests",
      "Configuration choices tied back to expected traffic flow",
      "Lab outputs explained in writing, not left as unexplained end states",
    ],
    cardAccent: "router",
  },
  {
    slug: "edge-to-cloud-architecture-study",
    title: "Edge-to-Cloud Architecture Study",
    category: "Cloud & IoT",
    summary:
      "A practical study case focused on how connected devices, local processing and cloud services fit together in a realistic architecture path.",
    objective:
      "Translate IoT and cloud studies into an architecture view that is understandable to employers and easy to extend with real implementations later.",
    technicalScope:
      "Connected devices, edge processing, cloud integration, service boundaries, data flow thinking and practical architecture communication.",
    environment:
      "Course-driven architecture work supported by AWS basics, virtualization knowledge and container-oriented thinking.",
    implementation:
      "I mapped a realistic edge-to-cloud flow, identified service responsibilities, separated local and cloud concerns, and wrote the design in a way that supports later implementation and portfolio replacement with real project data.",
    validation:
      "Validated through architecture consistency review, service-boundary reasoning and whether the design can be explained without hand-waving.",
    result:
      "The result is a clearer bridge between IoT studies and cloud-oriented junior roles, especially where architecture thinking and implementation direction both matter.",
    learned:
      "A useful architecture explanation should make trade-offs and boundaries clearer, not hide uncertainty behind abstract diagrams.",
    stack: ["IoT", "AWS basics", "Architecture", "Virtualization", "Containers"],
    evidence: [
      "Architecture flow described from device side to cloud side",
      "Service boundaries and responsibilities made explicit",
      "Designed as a realistic study-to-implementation bridge instead of a generic concept diagram",
    ],
    cardAccent: "phone",
  },
  {
    slug: "practical-cybersecurity-validation-case",
    title: "Practical Cybersecurity Validation Case",
    category: "Cybersecurity",
    summary:
      "Validation-focused lab case built around checking exposure, confirming findings and documenting security-relevant behavior clearly.",
    objective:
      "Practice security work as verification and documentation instead of turning everything into exaggerated red-team storytelling.",
    technicalScope:
      "Exposure checking, service verification, risk framing, evidence gathering, technical write-up discipline and scope awareness.",
    environment:
      "Practical cybersecurity course context, Linux/macOS CLI tooling and structured reporting workflow.",
    implementation:
      "I validated reachable services, checked how they responded under test conditions, framed the finding realistically, and wrote the outcome with enough context that someone else could understand both the risk and the limits of the result.",
    validation:
      "Validated through command output, repeatable checks, screenshots, notes and clear statement of what was observed versus what was only inferred.",
    result:
      "This improved my confidence in doing security-related work carefully: verify first, document clearly, avoid hype and keep claims proportional to evidence.",
    learned:
      "Security work becomes more credible when the write-up is accurate, scoped and evidence-based instead of dramatic.",
    stack: ["Cybersecurity", "Linux CLI", "Validation", "Reporting", "Evidence"],
    evidence: [
      "Findings separated from assumptions",
      "Command-based checks used as evidence",
      "Risk described in practical terms without exaggeration",
    ],
    cardAccent: "switch",
  },
];
