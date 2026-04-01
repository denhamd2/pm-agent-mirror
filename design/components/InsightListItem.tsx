/**
 * InsightListItem
 * 
 * Icon + text insight item with optional inline link
 * Used in Candidate Insights, Fit & Gap analysis, and similar list patterns
 * 
 * Usage:
 * <InsightListItem 
 *   icon={starIcon} 
 *   text="Rated on questionnaire responses and portfolio" 
 * />
 * 
 * <InsightListItem 
 *   icon={checkIcon} 
 *   text="React/Typescript expertise"
 *   linkText="Led multiple LL modernization initiatives"
 *   onLinkClick={() => console.log('View evidence')}
 * />
 */

import { Flex } from '@workday/canvas-kit-react/layout';
import { BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { colors } from '@workday/canvas-kit-react/tokens';
import type { CanvasSystemIcon } from '@workday/design-assets-types';

export interface InsightListItemProps {
  icon: CanvasSystemIcon;
  iconColor?: string;
  text: string;
  linkText?: string;
  onLinkClick?: () => void;
}

export function InsightListItem({ 
  icon, 
  iconColor = colors.blackPepper600,
  text, 
  linkText, 
  onLinkClick 
}: InsightListItemProps) {
  // #region agent log
  fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'InsightListItem.tsx:36',message:'InsightListItem render',data:{text,hasLink:!!linkText,iconDefined:!!icon},timestamp:Date.now(),hypothesisId:'B,E'})}).catch(()=>{});
  // #endregion

  return (
    <Flex gap="xs" alignItems="flex-start">
      <SystemIcon icon={icon} size={16} color={iconColor} style={{ marginTop: '2px', flexShrink: 0 }} />
      <BodyText size="small">
        {text}
        {linkText && (
          <>
            {' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onLinkClick?.();
              }}
              style={{
                color: colors.blueberry400,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {linkText}
            </a>
          </>
        )}
      </BodyText>
    </Flex>
  );
}
