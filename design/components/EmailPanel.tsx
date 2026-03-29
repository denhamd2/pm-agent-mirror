import React, { useState } from 'react';
import { PrimaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { xSmallIcon, mailIcon, uploadClipIcon } from '@workday/canvas-system-icons-web';
import { SANA_COMM_PANEL_SURFACE, SANA_LINK_ACCENT } from './sanaShellTheme';
import { EmailComposer } from './EmailComposer';
import { ThreadExpansion } from './ThreadExpansion';
import { SanaCommMessageBubble } from './SanaCommPanelPatterns';

export interface EmailThread {
  id: string;
  subject: string;
  messages: Array<{
    id: string | number; // Allow both for flexibility with Date.now()
    text: string;
    align: 'start' | 'end';
    timestamp: string;
    attachments?: string[];
  }>;
}

export interface EmailPanelProps {
  threads: EmailThread[];
  activeThreadId: string | null;
  onThreadSelect: (threadId: string | null) => void;
  onNewEmail: () => void;
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
  showBranding?: boolean;
  brandingChecked?: boolean;
  onBrandingChange?: (checked: boolean) => void;
  onClosePanel: () => void;
}

/**
 * Complete email panel with thread sidebar + composer + expansion.
 * 
 * Features:
 * - Left sidebar: Thread list (250px) with New button
 * - Right panel: EmailComposer + ThreadExpansion + empty state
 * - Single scroll area (Gmail pattern)
 * - All v75 learnings baked in
 * - 950px default width (passed to CommunicationDock)
 */
export const EmailPanel: React.FC<EmailPanelProps> = ({
  threads,
  activeThreadId,
  onThreadSelect,
  onNewEmail,
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
  showBranding = false,
  brandingChecked = false,
  onBrandingChange,
  onClosePanel,
}) => {
  const [threadExpanded, setThreadExpanded] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  return (
    <Flex
      flexDirection="row"
      flex={1}
      minHeight={0}
      style={{ overflow: 'hidden' }}
      role="dialog"
      aria-modal={true}
      aria-labelledby="email-panel-title"
    >
      {/* LEFT SIDEBAR: Thread List */}
      <Flex
        flexDirection="column"
        width={250}
        style={{
          borderRight: `1px solid ${colors.soap300}`,
          backgroundColor: SANA_COMM_PANEL_SURFACE,
        }}
      >
        <Box padding="m" style={{ borderBottom: `1px solid ${colors.soap300}`, flexShrink: 0 }}>
          <Flex alignItems="center" gap="s">
            <SystemIcon icon={mailIcon} size={22} color={SANA_LINK_ACCENT} aria-hidden />
            <Heading size="small" id="email-panel-title">
              Email
            </Heading>
          </Flex>
        </Box>
        <Box padding="m" style={{ flexShrink: 0 }}>
          <PrimaryButton size="small" style={{ width: '100%' }} onClick={onNewEmail}>
            New
          </PrimaryButton>
        </Box>
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          {threads.map((thread) => (
            <Box
              key={thread.id}
              padding="s"
              style={{
                cursor: 'pointer',
                backgroundColor:
                  activeThreadId === thread.id ? colors.soap200 : 'transparent',
                borderBottom: `1px solid ${colors.soap200}`,
              }}
              onClick={() => {
                onThreadSelect(thread.id);
                setThreadExpanded(false); // Collapsed by default on selection
              }}
            >
              <BodyText size="small" fontWeight="bold">
                {thread.subject}
              </BodyText>
              <BodyText size="small" color={colors.blackPepper500}>
                {thread.messages[thread.messages.length - 1]?.timestamp}
              </BodyText>
            </Box>
          ))}
        </Box>
      </Flex>

      {/* RIGHT PANEL: Composer + Thread History (Single Scroll Area) */}
      <Flex
        flexDirection="column"
        flex={1}
        minWidth={0}
        style={{
          backgroundColor: colors.frenchVanilla100,
          overflowY: 'auto', // Single scroll area for entire panel
        }}
      >
        {/* Header (scrolls with content) */}
        <Box
          padding="m"
          style={{
            borderBottom: `1px solid ${colors.soap300}`,
            backgroundColor: SANA_COMM_PANEL_SURFACE,
          }}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="small">
              {activeThreadId ? subject || 'No Subject' : 'New Email'}
            </Heading>
            <ToolbarIconButton
              icon={xSmallIcon}
              aria-label="Close panel"
              onClick={onClosePanel}
            />
          </Flex>
        </Box>

        {/* Composer Section (scrolls naturally) */}
        <EmailComposer
          from={from}
          to={to}
          cc={cc}
          subject={subject}
          body={body}
          onFromChange={onFromChange}
          onToChange={onToChange}
          onCcChange={onCcChange}
          onSubjectChange={onSubjectChange}
          onBodyChange={onBodyChange}
          onSend={onSend}
          showBranding={showBranding}
          brandingChecked={brandingChecked}
          onBrandingChange={onBrandingChange}
        />

        {/* Thread History - Inline Expansion (Gmail pattern) */}
        {activeThreadId && activeThread && (
          <Box padding="l" style={{ backgroundColor: colors.frenchVanilla100 }}>
            <ThreadExpansion
              messageCount={activeThread.messages.length}
              expanded={threadExpanded}
              onToggle={() => setThreadExpanded(!threadExpanded)}
            >
              {activeThread.messages.map((msg) => (
                <Box key={msg.id} marginBottom="m">
                  <SanaCommMessageBubble align={msg.align} timestamp={msg.timestamp}>
                    <Box>
                      <BodyText size="small">{msg.text}</BodyText>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <Flex gap="xs" marginTop="s" alignItems="center">
                          <SystemIcon
                            icon={uploadClipIcon}
                            size={16}
                            color={colors.blackPepper500}
                          />
                          <BodyText size="small" color={SANA_LINK_ACCENT}>
                            {msg.attachments[0]}
                          </BodyText>
                        </Flex>
                      )}
                    </Box>
                  </SanaCommMessageBubble>
                </Box>
              ))}
            </ThreadExpansion>
          </Box>
        )}

        {/* Empty State for New Email */}
        {!activeThreadId && (
          <Box
            padding="l"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BodyText size="small" color={colors.blackPepper500}>
              Compose your message above.
            </BodyText>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
