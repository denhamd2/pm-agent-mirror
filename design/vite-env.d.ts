/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set at build time only in `vite.config.public.ts` (GHE Pages catalogue bundle). */
  readonly VITE_PUBLIC_PROTOTYPE_CATALOGUE?: string;
}
