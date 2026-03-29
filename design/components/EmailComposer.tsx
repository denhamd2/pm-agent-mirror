import React from 'react';
import { PrimaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { BodyText } from '@workday/canvas-kit-react/text';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { uploadClipIcon } from '@workday/canvas-system-icons-web';
import { sanaCommFormControlStyle } from './SanaCommPanelPatterns';
import { SANA_COMM_PANEL_SURFACE } from './sanaShellTheme';
import { RichTextEditor } from './RichTextEditor';

export interface EmailComposerProps {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  body: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onCcChange?: (val: string) => void;
  onSubjectChange: (val: string) => void;
  onBodyChange: (html: string, text: string) => void;
  onSend: () => void;
  sendDisabled?: boolean;
  showBranding?: boolean;
  brandingChecked?: boolean;
  onBrandingChange?: (checked: boolean) => void;
  showAttachments?: boolean;
  candidateData?: {
    name?: string;
    firstName?: string;
    email?: string;
    jobTitle?: string;
    requisitionId?: string;
    recruiterName?: string;
    companyName?: string;
  };
}

/**
 * Full-featured email composer combining fields + rich text + actions.
 * 
 * Features:
 * - From/To/Cc/Subject fields (Sana form controls, 32px height)
 * - Integrated RichTextEditor (240-400px range)
 * - Email templates with token replacement
 * - GenAI text improvement (mocked for prototype)
 * - Attachment icon button
 * - Optional branding checkbox
 * - Send button (disabled state based on body text)
 * - All styling matches v75 patterns
 */
export const EmailComposer: React.FC<EmailComposerProps> = ({
  from,
  to,
  cc = '',
  subject,
  body,
  onFromChange,
  onToChange,
  onCcChange,
  onSubjectChange,
  onBodyChange,
  onSend,
  sendDisabled,
  showBranding = false,
  brandingChecked = false,
  onBrandingChange,
  showAttachments = true,
  candidateData = {},
}) => {
  return (
    <Box
      padding="l"
      style={{
        borderBottom: `1px solid ${colors.soap300}`,
        backgroundColor: SANA_COMM_PANEL_SURFACE,
      }}
    >
      {/* Email Fields */}
      <Flex flexDirection="column" gap="xs" marginBottom="s">
        <Flex alignItems="center" gap="s">
          <BodyText size="small" color={colors.blackPepper500} style={{ width: 60 }}>
            From:
          </BodyText>
          <Box
            as="input"
            value={from}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFromChange(e.target.value)}
            style={{ ...sanaCommFormControlStyle(), flex: 1, minHeight: 32, padding: '4px 8px' }}
          />
        </Flex>
        <Flex alignItems="center" gap="s">
          <BodyText size="small" color={colors.blackPepper500} style={{ width: 60 }}>
            To:
          </BodyText>
          <Box
            as="input"
            value={to}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onToChange(e.target.value)}
            style={{ ...sanaCommFormControlStyle(), flex: 1, minHeight: 32, padding: '4px 8px' }}
          />
        </Flex>
        {onCcChange && (
          <Flex alignItems="center" gap="s">
            <BodyText size="small" color={colors.blackPepper500} style={{ width: 60 }}>
              Cc:
            </BodyText>
            <Box
              as="input"
              value={cc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCcChange(e.target.value)}
              placeholder="Add Cc..."
              style={{ ...sanaCommFormControlStyle(), flex: 1, minHeight: 32, padding: '4px 8px' }}
            />
          </Flex>
        )}
        <Flex alignItems="center" gap="s">
          <BodyText size="small" color={colors.blackPepper500} style={{ width: 60 }}>
            Subject:
          </BodyText>
          <Box
            as="input"
            value={subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSubjectChange(e.target.value)}
            style={{ ...sanaCommFormControlStyle(), flex: 1, minHeight: 32, padding: '4px 8px' }}
          />
        </Flex>
      </Flex>

      {/* Rich Text Editor */}
      <RichTextEditor
        value={body}
        onChange={onBodyChange}
        placeholder="Type your email..."
        showTemplates
        showGenAI
        candidateData={candidateData}
      />

      {/* Footer Actions */}
      <Flex justifyContent="space-between" alignItems="center" marginTop="s">
        <Flex gap="m" alignItems="center">
          {showAttachments && (
            <ToolbarIconButton icon={uploadClipIcon} aria-label="Attach file" />
          )}
          {showBranding && onBrandingChange && (
            <Checkbox
              checked={brandingChecked}
              onChange={(e) => onBrandingChange(e.target.checked)}
              label="Apply company branding"
            />
          )}
        </Flex>
        <PrimaryButton size="small" onClick={onSend} disabled={sendDisabled || !body.trim()}>
          Send Email
        </PrimaryButton>
      </Flex>
    </Box>
  );
};
