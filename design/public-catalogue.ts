/**
 * Allowlist of prototypes that ship to GHE Pages.
 *
 * Hardcoded - default-deny. Adding a prototype here triggers the public build,
 * which runs through `vite-plugin-forbidden-imports.ts`. If the new prototype
 * transitively touches any forbidden file (`data-*.ts`, dashboard `.tsx`,
 * `pm-agent-dashboard`, etc.), the build fails - that's the conscious-decision
 * gate. See `.cursor/rules/015-auto-commit-deploy.mdc` for the data-governance
 * rule.
 *
 * Localhost is the canonical full dashboard. The full prototype slug list lives
 * in `design/main.tsx` `PROTOTYPE_SLUGS`. Anything not in this allowlist falls
 * through to the public "localhost-only" placeholder.
 */
export type PublicPrototype = {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly category: 'Prototype';
};

export const PUBLIC_PROTOTYPES: readonly PublicPrototype[] = [
  {
    slug: 'candidate-grid-v84',
    name: 'Candidate Grid v84',
    description: 'Redesigned candidate grid for high-volume sourcing and screening.',
    category: 'Prototype',
  },
  {
    slug: 'india-native-whatsapp-v91',
    name: 'India Native WhatsApp v91',
    description: 'Native WhatsApp candidate experience for India recruiting.',
    category: 'Prototype',
  },
  {
    slug: 'recruiter-hub-genui-v95',
    name: 'Recruiter Hub GenUI',
    description: 'Generative UI dashboard for recruiters.',
    category: 'Prototype',
  },
  {
    slug: 'interview-intelligence-agent-v96',
    name: 'Interview Intelligence Agent',
    description: 'AI-powered interview transcription and scoring agent.',
    category: 'Prototype',
  },
  {
    slug: 'ai-system-of-record-v97',
    name: 'AI System of Record',
    description: "Central hub for managing an organisation's AI ecosystem.",
    category: 'Prototype',
  },
] as const;

export type PublicPrototypeSlug = (typeof PUBLIC_PROTOTYPES)[number]['slug'];

export const PUBLIC_PROTOTYPE_SLUGS: ReadonlySet<string> = new Set(
  PUBLIC_PROTOTYPES.map((p) => p.slug)
);
