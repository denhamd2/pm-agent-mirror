/**
 * CollapsibleSection
 * 
 * Reusable collapsible section with header + expandable content
 * Used for Candidate Insights, Fit & Gap analysis, and other progressive disclosure patterns
 * 
 * Usage:
 * <CollapsibleSection title="Candidate Insights" defaultOpen={true}>
 *   <InsightListItem icon={starIcon} text="Rated on questionnaire..." />
 * </CollapsibleSection>
 */

import { ReactNode, useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading } from '@workday/canvas-kit-react/text';
import { TertiaryButton } from '@workday/canvas-kit-react/button';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { chevronDownIcon, chevronRightIcon } from '@workday/canvas-system-icons-web';
import { colors } from '@workday/canvas-kit-react/tokens';

export interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // #region agent log
  fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'CollapsibleSection.tsx:27',message:'CollapsibleSection render',data:{title,defaultOpen,isOpen},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  return (
    <Box>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        marginBottom={isOpen ? 's' : 'zero'}
        style={{ cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Heading size="small">{title}</Heading>
        <TertiaryButton
          size="small"
          icon={isOpen ? chevronDownIcon : chevronRightIcon}
          aria-label={isOpen ? 'Collapse' : 'Expand'}
          aria-expanded={isOpen}
        />
      </Flex>
      {isOpen && <Box>{children}</Box>}
    </Box>
  );
}
