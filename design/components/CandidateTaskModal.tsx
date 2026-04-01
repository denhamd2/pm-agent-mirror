/**
 * CandidateTaskModal
 * 
 * Generic modal overlay for candidate tasks (dark overlay + centered card with close handling)
 * 
 * Use for: Task modals, document review, form submissions, confirmations
 * 
 * **Pattern**: Reusable modal wrapper - content is provided via children
 */

import { ReactNode } from 'react';
import { Box } from '@workday/canvas-kit-react/layout';

export interface CandidateTaskModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
  maxHeight?: string;
}

export const CandidateTaskModal: React.FC<CandidateTaskModalProps> = ({
  open,
  onClose,
  children,
  maxWidth = 600,
  maxHeight = '90vh',
}) => {
  if (!open) return null;

  return (
    <Box 
      role="dialog"
      aria-modal="true"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Box style={{ maxWidth, maxHeight, overflowY: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
};
