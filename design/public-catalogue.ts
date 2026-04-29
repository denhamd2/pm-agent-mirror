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
    slug: 'aadhaar-adobe-sign-v01',
    name: 'Aadhaar + Adobe Sign Offer v01',
    description:
      'India offer flow with Aadhaar verification and Adobe Sign signature integration.',
    category: 'Prototype',
  },
  {
    slug: 'candidate-grid-v84',
    name: 'Candidate Grid v84',
    description: 'Redesigned candidate grid for high-volume sourcing and screening.',
    category: 'Prototype',
  },
  {
    slug: 'recruiter-home-v85',
    name: 'Recruiter Home v85',
    description: 'Recruiter home dashboard pattern with priority workspace.',
    category: 'Prototype',
  },
  {
    slug: 'candidate-smart-view-v86',
    name: 'Candidate Smart View v86',
    description: 'Smart-view candidate detail with grouped insights and actions.',
    category: 'Prototype',
  },
  {
    slug: 'india-whatsapp-candidate-messaging-v88',
    name: 'India WhatsApp Candidate Messaging v88',
    description: 'WhatsApp two-way candidate messaging surface for India recruiters.',
    category: 'Prototype',
  },
  {
    slug: 'gcc-interview-scheduling-v90',
    name: 'GCC Interview Scheduling v90',
    description: 'GCC-aware interview scheduling with compliance nudges.',
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
  {
    slug: 'recruiter-hub-conversational-v98',
    name: 'Recruiter Hub Conversational v98',
    description: 'Prior conversational recruiter hub variant for comparison.',
    category: 'Prototype',
  },
  {
    slug: 'recruiter-hub-conversational-v99',
    name: 'Recruiter Hub Conversational v99',
    description: 'Latest conversational recruiter hub iteration.',
    category: 'Prototype',
  },
  {
    slug: 'universal-profile-eudi-wallet-v1',
    name: 'Universal Profile EUDI Wallet v1',
    description: 'Universal candidate profile with EUDI Wallet credential exchange.',
    category: 'Prototype',
  },
] as const;

export type PublicPrototypeSlug = (typeof PUBLIC_PROTOTYPES)[number]['slug'];

export const PUBLIC_PROTOTYPE_SLUGS: ReadonlySet<string> = new Set(
  PUBLIC_PROTOTYPES.map((p) => p.slug)
);
