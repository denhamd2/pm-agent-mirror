import React, { useEffect, useState, useRef, useCallback, useId } from 'react';
import type { CSSProperties } from 'react';
import { SecondaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { BodyText } from '@workday/canvas-kit-react/text';
import {
  alignCenterIcon,
  alignLeftIcon,
  alignRightIcon,
  boldIcon,
  chevronDownIcon,
  chevronDownSmallIcon,
  deviceDesktopIcon,
  devicePhoneIcon,
  italicsIcon,
  justifyIcon,
  linkIcon,
  orderedListIcon,
  strikethroughIcon,
  underlineIcon,
  undoLIcon,
  undoRIcon,
  unorderedListIcon,
  uploadClipIcon,
  starIcon,
} from '@workday/canvas-system-icons-web';
import { sanaCommFormControlStyle } from './SanaCommPanelPatterns';

const COMPOSE_TOOLTIP_BG = '#101820';

/** Black canvas-style tooltip with upward caret — matches Conversational Email compose toolbar PM capture. */
function ComposeToolbarBlackTooltip({ title, children }: { title: string; children: React.ReactNode }) {
  const tipId = useId();
  const [open, setOpen] = useState(false);
  return (
    <Box
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
    >
      {children}
      {open ? (
        <Box
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '100%',
            zIndex: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            paddingTop: 6,
          }}
        >
          <Box
            style={{
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: `6px solid ${COMPOSE_TOOLTIP_BG}`,
              flexShrink: 0,
            }}
          />
          <Box
            id={tipId}
            role="tooltip"
            style={{
              marginTop: -1,
              padding: '8px 12px',
              backgroundColor: COMPOSE_TOOLTIP_BG,
              color: colors.frenchVanilla100,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'inherit',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(11, 31, 66, 0.22)',
            }}
          >
            {title}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export const RECRUITING_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'interview-availability',
    name: 'Interview Availability Request',
    subject: 'Interview Availability - {{jobTitle}}',
    body: `Hi {{candidateFirstName}},

Thank you for your application for the {{jobTitle}} role ({{requisitionId}}). We were impressed with your background and would like to schedule an interview.

Are you available for a video call next week? We have slots available on:
• Tuesday, {{interviewDate}} at 10:00 or 14:00 CET
• Thursday, {{interviewDate}} at 9:00 or 15:30 CET

Please let me know which time works best for you, or suggest an alternative if none of these suit.

Looking forward to speaking with you.

Best regards,
{{recruiterName}}`,
  },
  {
    id: 'interview-confirmation',
    name: 'Interview Confirmation',
    subject: 'Interview Confirmed - {{jobTitle}}',
    body: `Hi {{candidateFirstName}},

Your interview is confirmed for {{interviewDate}} at {{interviewTime}} CET.

Interview Details:
• Role: {{jobTitle}}
• Format: Video Conference
• Duration: 45 minutes
• Interviewer: {{hiringManagerName}}, Hiring Manager

You will receive a calendar invitation with the video link shortly. Please review the job description and prepare any questions you may have.

If you need to reschedule, please let me know as soon as possible.

Best regards,
{{recruiterName}}`,
  },
  {
    id: 'offer-renegotiation',
    name: 'Offer Renegotiation',
    subject: 'Offer Discussion - {{jobTitle}}',
    body: `Hi {{candidateFirstName}},

Thank you for your feedback on our offer for the {{jobTitle}} position. I'd like to discuss your concerns and explore how we might adjust the terms.

Could we schedule a call this week to review the following:
• Compensation structure
• Benefits package
• Start date flexibility
• {{additionalTopic}}

I have availability on {{availabilityDate}} or {{availabilityDate}}. Please let me know what works for you, or suggest an alternative time.

Looking forward to finding a solution that works for both of us.

Best regards,
{{recruiterName}}`,
  },
  {
    id: 'application-status',
    name: 'Application Status Update',
    subject: 'Application Update - {{jobTitle}}',
    body: `Hi {{candidateFirstName}},

Thank you for applying for the {{jobTitle}} role at {{companyName}}. I wanted to provide you with an update on your application status.

Current Status: {{applicationStatus}}

{{statusDetails}}

If you have any questions about your application or would like more information about the role, please feel free to reach out.

Thank you for your interest in {{companyName}}.

Best regards,
{{recruiterName}}`,
  },
  {
    id: 'documents-request',
    name: 'Additional Documents Request',
    subject: 'Documents Required - {{jobTitle}}',
    body: `Hi {{candidateFirstName}},

Thank you for your continued interest in the {{jobTitle}} position. To proceed with your application, we need the following documents:

{{documentList}}

Please upload these documents through your candidate portal, or reply to this email with attachments.

We aim to review your complete application within 2-3 business days of receiving all materials.

If you have any questions or need assistance, please let me know.

Best regards,
{{recruiterName}}`,
  },
  {
    id: 'pre-screen-followup',
    name: 'Pre-Screen Questions Follow-Up',
    subject: 'Follow-Up Questions - {{jobTitle}}',
    body: `Hi {{candidateFirstName}},

Thank you for completing the pre-screening questionnaire for the {{jobTitle}} role. I have a few follow-up questions to better understand your background:

{{questionList}}

Please reply at your convenience. Your responses will help us move your application forward.

If you'd prefer to discuss these questions over a brief phone call instead, I'm happy to schedule 15 minutes this week.

Best regards,
{{recruiterName}}`,
  },
];

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string, text: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  /**
   * Templates dropdown — **only** when `composeLayout` is false (compact toolbar).
   * When `composeLayout` is true (Conversational Email dock), templates are **never** shown — MVP rule; prop is ignored (see `.cursor/rules/012-two-way-email-prototype-compose-mvp.mdc`).
   */
  showTemplates?: boolean;
  /**
   * Shows GenAI “improve” control on the **compact** toolbar (`composeLayout` false), e.g. offer letter.
   * **Not rendered** when `composeLayout` is true — Conversational Email compose MVP excludes GenAI on the compose toolbar (see `.cursor/rules/012-two-way-email-prototype-compose-mvp.mdc`).
   */
  showGenAI?: boolean;
  candidateData?: {
    name?: string;
    firstName?: string;
    email?: string;
    jobTitle?: string;
    requisitionId?: string;
    recruiterName?: string;
    companyName?: string;
  };
  /**
   * Full compose-dock chrome: Figma-style toolbar (undo → device preview). MVP uses white body surface (see `.cursor/rules/012-two-way-email-prototype-compose-mvp.mdc`).
   * When false, uses compact toolbar for offer-letter and other surfaces.
   */
  composeLayout?: boolean;
  /** Paperclip in compose toolbar — wire to hidden file input `click()`. */
  onAttachClick?: () => void;
  /** Insert between toolbar and editor body (e.g. attachment chips). Design order: toolbar → attachments → body. */
  slotBelowToolbar?: React.ReactNode;
  /** Outer canvas behind compose body (reply/forward quoted thread is full-bleed white on this surface). */
  canvasBackgroundColor?: string;
  /**
   * Reply/Forward: quoted conversation rendered **inside** the compose body card below the contenteditable
   * (Outlook-style), non-editable.
   */
  composeQuotedThread?: React.ReactNode;
}

const toolbarDivider = (
  <Box
    width={1}
    height={24}
    style={{ backgroundColor: colors.soap300, margin: '0 4px', flexShrink: 0 }}
    aria-hidden
  />
);

function execWithFocus(editorRef: React.RefObject<HTMLDivElement | null>, fn: () => void) {
  editorRef.current?.focus();
  fn();
}

/** Line breaks from `<br>` / blocks; `textContent` flattens compose to one line. */
function plainTextFromContentEditable(el: HTMLElement): string {
  const raw = typeof el.innerText === 'string' ? el.innerText : el.textContent || '';
  return raw.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ');
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type here...',
  minHeight = 240,
  maxHeight = 400,
  showTemplates = false,
  showGenAI = false,
  candidateData = {},
  composeLayout = false,
  onAttachClick,
  slotBelowToolbar,
  canvasBackgroundColor = '#F3F4F6',
  composeQuotedThread,
}) => {
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [genAILoading, setGenAILoading] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [composeTextColorValue, setComposeTextColorValue] = useState('#101820');
  const editorRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-rich-text-editor-placeholder', '1');
    style.innerHTML = `
      [contenteditable][data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: ${colors.blackPepper400};
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existing = document.querySelector('style[data-rich-text-editor-placeholder="1"]');
      if (existing?.parentNode) existing.parentNode.removeChild(existing);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (templatesRef.current && !templatesRef.current.contains(e.target as Node)) {
        setTemplatesOpen(false);
      }
    };
    if (templatesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [templatesOpen]);

  useEffect(() => {
    if (!editorRef.current) return;
    const nextHtml = value.includes('<') ? value : value.replace(/\n/g, '<br>');
    if (editorRef.current.innerHTML !== nextHtml && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [value]);

  const replaceTokens = (text: string): string => {
    const tokens = {
      candidateName: candidateData.name || 'Candidate Name',
      candidateFirstName: candidateData.firstName || 'Candidate',
      jobTitle: candidateData.jobTitle || 'Position Title',
      requisitionId: candidateData.requisitionId || 'REQ-XXXX-XXXX',
      recruiterName: candidateData.recruiterName || 'Recruiter Name',
      companyName: candidateData.companyName || 'Company Name',
      hiringManagerName: 'Hiring Manager',
      interviewDate: 'Date TBD',
      interviewTime: 'Time TBD',
      availabilityDate: 'Date TBD',
      applicationStatus: 'Under Review',
      statusDetails: 'We are currently reviewing your application and will be in touch soon.',
      additionalTopic: 'Additional considerations',
      documentList: '• Document 1\n• Document 2',
      questionList: '1. Question here\n2. Another question',
    };

    let replaced = text;
    Object.entries(tokens).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      replaced = replaced.replace(regex, val);
    });
    return replaced;
  };

  const applyTemplate = (template: EmailTemplate) => {
    const bodyWithTokens = replaceTokens(template.body);
    const htmlContent = bodyWithTokens.replace(/\n/g, '<br>');

    if (editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
      onChange(htmlContent, bodyWithTokens);
    }
    setTemplatesOpen(false);
  };

  const improveWithGenAI = async () => {
    if (!editorRef.current || genAILoading) return;

    const currentText = plainTextFromContentEditable(editorRef.current);
    if (!currentText.trim()) return;

    setGenAILoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    let improved = currentText;

    if (currentText.length < 100 && /hi|hey|hello/i.test(currentText)) {
      improved = `Hi ${candidateData.firstName || '{{candidateFirstName}}'},

Thank you for your application. ${currentText.replace(/^(hi|hey|hello)[,\s]*/i, '')}

Please let me know if you have any questions.

Best regards,
${candidateData.recruiterName || '{{recruiterName}}'}`;
    } else if (!/^(hi|hello|dear)/i.test(currentText) || !/regards|thanks|sincerely/i.test(currentText)) {
      improved = `Hi ${candidateData.firstName || '{{candidateFirstName}}'},

${currentText}

Best regards,
${candidateData.recruiterName || '{{recruiterName}}'}`;
    } else if (currentText.length < 150) {
      improved = currentText
        .replace(/\bthx\b/gi, 'Thank you')
        .replace(/\bpls\b/gi, 'please')
        .replace(/\bu\b/gi, 'you')
        .replace(/\basap\b/gi, 'as soon as possible');

      if (improved === currentText) {
        improved = `${improved}\n\nIf you have any questions or need clarification, please don't hesitate to reach out. I'm happy to help.`;
      }
    } else {
      improved = currentText
        .replace(/\bthx\b/gi, 'Thank you')
        .replace(/\bpls\b/gi, 'please')
        .replace(/!/g, '.');
    }

    const htmlContent = improved.replace(/\n/g, '<br>');
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
      onChange(htmlContent, improved);
    }

    setGenAILoading(false);
  };

  const emitInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    onChange(el.innerHTML, plainTextFromContentEditable(el));
  }, [onChange]);

  /** Reply/Forward: quoted thread fills natural height — no inner scroll / fixed pane height. */
  const quotedNaturalHeight = Boolean(composeQuotedThread);

  const composeToolbarStyle: CSSProperties = {
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    padding: '8px 10px',
    borderBottom: `1px solid ${colors.soap300}`,
    backgroundColor: colors.soap100,
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'visible',
  };

  const paragraphSelect = (
    <select
      aria-label="Paragraph style"
      defaultValue="normal"
      onChange={(e) => {
        execWithFocus(editorRef, () => {
          const v = e.target.value;
          document.execCommand('formatBlock', false, v === 'heading' ? 'h3' : 'p');
        });
        emitInput();
      }}
      style={{
        height: 32,
        minWidth: 108,
        padding: '0 28px 0 10px',
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 4,
        border: `1px solid ${colors.soap400}`,
        backgroundColor: colors.soap100,
        color: colors.blackPepper600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        appearance: 'none',
        backgroundImage: `linear-gradient(45deg,transparent 50%,${colors.blackPepper400} 50%),linear-gradient(135deg,${colors.blackPepper400} 50%,transparent 50%)`,
        backgroundPosition: 'calc(100% - 14px) calc(50% - 3px),calc(100% - 9px) calc(50% - 3px)',
        backgroundSize: '5px 5px,5px 5px',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <option value="normal">Normal</option>
      <option value="heading">Heading</option>
    </select>
  );

  const composeTextColorSelect = (
    <select
      aria-label="Text color"
      value={composeTextColorValue}
      onChange={(e) => {
        const v = e.target.value;
        if (v === '__custom__') {
          const hex = window.prompt('Text color (hex, e.g. #0875e1)', '#101820');
          if (hex) {
            execWithFocus(editorRef, () => document.execCommand('foreColor', false, hex));
            emitInput();
          }
          return;
        }
        setComposeTextColorValue(v);
        execWithFocus(editorRef, () => document.execCommand('foreColor', false, v));
        emitInput();
      }}
      style={{
        height: 32,
        minWidth: 112,
        padding: '0 28px 0 10px',
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 4,
        border: `1px solid ${colors.soap400}`,
        backgroundColor: colors.soap100,
        color: colors.blackPepper600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        appearance: 'none',
        backgroundImage: `linear-gradient(45deg,transparent 50%,${colors.blackPepper400} 50%),linear-gradient(135deg,${colors.blackPepper400} 50%,transparent 50%)`,
        backgroundPosition: 'calc(100% - 14px) calc(50% - 3px),calc(100% - 9px) calc(50% - 3px)',
        backgroundSize: '5px 5px,5px 5px',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <option value="#101820">Default</option>
      <option value="#0875e1">Link blue</option>
      <option value="#005CB9">Primary blue</option>
      <option value="#CC4B14">Orange</option>
      <option value="#BD3609">Cinnamon</option>
      <option value="__custom__">Custom…</option>
    </select>
  );

  const alignBtn = (icon: typeof alignLeftIcon, label: string, cmd: string, active?: boolean) => (
    <ComposeToolbarBlackTooltip title={label}>
      <Box
        style={{
          display: 'inline-flex',
          borderRadius: 4,
          backgroundColor: active ? colors.blueberry100 : 'transparent',
          border: active ? `1px solid ${colors.blueberry500}` : '1px solid transparent',
          padding: 2,
        }}
      >
        <ToolbarIconButton
          icon={icon}
          aria-label={label}
          aria-pressed={active}
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand(cmd, false));
            emitInput();
          }}
        />
      </Box>
    </ComposeToolbarBlackTooltip>
  );

  const editorInner = (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={() => emitInput()}
      style={{
        ...sanaCommFormControlStyle(),
        ...(composeLayout ? { backgroundColor: colors.frenchVanilla100 } : {}),
        width: '100%',
        maxWidth: composeLayout && devicePreview === 'mobile' ? 375 : '100%',
        marginLeft: composeLayout && devicePreview === 'mobile' ? 'auto' : undefined,
        marginRight: composeLayout && devicePreview === 'mobile' ? 'auto' : undefined,
        minHeight,
        maxHeight,
        padding: 16,
        borderRadius: composeLayout ? 6 : undefined,
        overflowY: 'auto',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );

  const composeToolbar = (
    <Flex style={composeToolbarStyle}>
      <ComposeToolbarBlackTooltip title="Undo">
        <ToolbarIconButton
          icon={undoLIcon}
          aria-label="Undo"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('undo', false));
            emitInput();
          }}
        />
      </ComposeToolbarBlackTooltip>
      <ComposeToolbarBlackTooltip title="Redo">
        <ToolbarIconButton
          icon={undoRIcon}
          aria-label="Redo"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('redo', false));
            emitInput();
          }}
        />
      </ComposeToolbarBlackTooltip>
      {toolbarDivider}
      {onAttachClick ? (
        <ComposeToolbarBlackTooltip title="Attach file">
          <ToolbarIconButton
            icon={uploadClipIcon}
            aria-label="Attach file"
            onClick={() => {
              editorRef.current?.focus();
              onAttachClick();
            }}
          />
        </ComposeToolbarBlackTooltip>
      ) : null}
      {toolbarDivider}
      <ComposeToolbarBlackTooltip title="Paragraph style">
        {paragraphSelect}
      </ComposeToolbarBlackTooltip>
      {toolbarDivider}
      <ComposeToolbarBlackTooltip title="Bold">
        <ToolbarIconButton
          icon={boldIcon}
          aria-label="Bold"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('bold', false));
            emitInput();
          }}
        />
      </ComposeToolbarBlackTooltip>
      <ComposeToolbarBlackTooltip title="Italic">
        <ToolbarIconButton
          icon={italicsIcon}
          aria-label="Italic"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('italic', false));
            emitInput();
          }}
        />
      </ComposeToolbarBlackTooltip>
      <ComposeToolbarBlackTooltip title="Underline">
        <ToolbarIconButton
          icon={underlineIcon}
          aria-label="Underline"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('underline', false));
            emitInput();
          }}
        />
      </ComposeToolbarBlackTooltip>
      <ComposeToolbarBlackTooltip title="Strikethrough">
        <ToolbarIconButton
          icon={strikethroughIcon}
          aria-label="Strikethrough"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('strikeThrough', false));
            emitInput();
          }}
        />
      </ComposeToolbarBlackTooltip>
      {toolbarDivider}
      <ComposeToolbarBlackTooltip title="Text color">{composeTextColorSelect}</ComposeToolbarBlackTooltip>
      {toolbarDivider}
      {alignBtn(alignLeftIcon, 'Align left', 'justifyLeft', true)}
      {alignBtn(alignCenterIcon, 'Align center', 'justifyCenter')}
      {alignBtn(alignRightIcon, 'Align right', 'justifyRight')}
      {alignBtn(justifyIcon, 'Justify', 'justifyFull')}
      {toolbarDivider}
      <ComposeToolbarBlackTooltip title="Bulleted list">
        <ToolbarIconButton
          icon={unorderedListIcon}
          aria-label="Bulleted list"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('insertUnorderedList', false));
            emitInput();
          }}
        />
      </ComposeToolbarBlackTooltip>
      <ComposeToolbarBlackTooltip title="Numbered list">
        <ToolbarIconButton
          icon={orderedListIcon}
          aria-label="Numbered list"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('insertOrderedList', false));
            emitInput();
          }}
        />
      </ComposeToolbarBlackTooltip>
      {toolbarDivider}
      <ComposeToolbarBlackTooltip title="Link">
        <Flex alignItems="center" gap={0} style={{ flexShrink: 0 }}>
          <ToolbarIconButton
            icon={linkIcon}
            aria-label="Link"
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) {
                execWithFocus(editorRef, () => document.execCommand('createLink', false, url));
                emitInput();
              }
            }}
          />
          <Box aria-hidden style={{ display: 'flex', alignItems: 'center', marginLeft: -6, paddingRight: 2 }}>
            <SystemIcon icon={chevronDownSmallIcon} size={18} color={colors.blackPepper400} />
          </Box>
        </Flex>
      </ComposeToolbarBlackTooltip>
      {toolbarDivider}
      <Box style={{ display: 'inline-flex', borderRadius: 4, backgroundColor: colors.soap200, padding: 2, gap: 2 }}>
        <ComposeToolbarBlackTooltip title="Desktop preview">
          <Box
            style={{
              borderRadius: 4,
              border: devicePreview === 'desktop' ? `1px solid ${colors.blueberry500}` : '1px solid transparent',
              backgroundColor: devicePreview === 'desktop' ? colors.blueberry100 : 'transparent',
            }}
          >
            <ToolbarIconButton
              icon={deviceDesktopIcon}
              aria-label="Desktop preview"
              aria-pressed={devicePreview === 'desktop'}
              onClick={() => setDevicePreview('desktop')}
            />
          </Box>
        </ComposeToolbarBlackTooltip>
        <ComposeToolbarBlackTooltip title="Mobile preview">
          <Box
            style={{
              borderRadius: 4,
              border: devicePreview === 'mobile' ? `1px solid ${colors.blueberry500}` : '1px solid transparent',
              backgroundColor: devicePreview === 'mobile' ? colors.blueberry100 : 'transparent',
            }}
          >
            <ToolbarIconButton
              icon={devicePhoneIcon}
              aria-label="Mobile preview"
              aria-pressed={devicePreview === 'mobile'}
              onClick={() => setDevicePreview('mobile')}
            />
          </Box>
        </ComposeToolbarBlackTooltip>
      </Box>
      {(showTemplates && !composeLayout) ? (
        <Flex gap="s" alignItems="center" style={{ marginLeft: 'auto', flexWrap: 'wrap' }}>
          <div ref={templatesRef} style={{ position: 'relative' }}>
            <SecondaryButton
              size="small"
              icon={chevronDownIcon}
              iconPosition="end"
              onClick={() => setTemplatesOpen(!templatesOpen)}
            >
              Templates
            </SecondaryButton>

            {templatesOpen && (
              <Box
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  backgroundColor: colors.frenchVanilla100,
                  border: `1px solid ${colors.soap300}`,
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  minWidth: 280,
                  maxHeight: 400,
                  overflowY: 'auto',
                }}
              >
                {RECRUITING_EMAIL_TEMPLATES.map((template) => (
                  <Box
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${colors.soap200}`,
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.soap100;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <BodyText size="small" fontWeight="bold" style={{ marginBottom: 4 }}>
                      {template.name}
                    </BodyText>
                    <BodyText size="small" color="hint">
                      {template.subject}
                    </BodyText>
                  </Box>
                ))}
              </Box>
            )}
          </div>
        </Flex>
      ) : null}
    </Flex>
  );

  const simpleToolbar = (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="xxs"
      style={{
        border: `1px solid ${colors.soap300}`,
        borderRadius: '12px 12px 0 0',
        borderBottom: 'none',
        backgroundColor: colors.soap100,
      }}
    >
      <Flex gap="xxs">
        <ToolbarIconButton
          icon={boldIcon}
          aria-label="Bold"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('bold', false));
            emitInput();
          }}
        />
        <ToolbarIconButton
          icon={italicsIcon}
          aria-label="Italic"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('italic', false));
            emitInput();
          }}
        />
        <ToolbarIconButton
          icon={underlineIcon}
          aria-label="Underline"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('underline', false));
            emitInput();
          }}
        />
        <ToolbarIconButton
          icon={linkIcon}
          aria-label="Link"
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              execWithFocus(editorRef, () => document.execCommand('createLink', false, url));
              emitInput();
            }
          }}
        />
        <ToolbarIconButton
          icon={unorderedListIcon}
          aria-label="Bulleted list"
          onClick={() => {
            execWithFocus(editorRef, () => document.execCommand('insertUnorderedList', false));
            emitInput();
          }}
        />
      </Flex>
      <Flex gap="s" alignItems="center">
        {showGenAI && (
          <ToolbarIconButton
            icon={starIcon}
            aria-label={genAILoading ? 'Improving...' : 'Improve with GenAI'}
            onClick={improveWithGenAI}
            disabled={genAILoading}
            style={{
              opacity: genAILoading ? 0.6 : 1,
              cursor: genAILoading ? 'wait' : 'pointer',
            }}
          />
        )}
        {showTemplates && (
          <div ref={templatesRef} style={{ position: 'relative' }}>
            <SecondaryButton
              size="small"
              icon={chevronDownIcon}
              iconPosition="end"
              onClick={() => setTemplatesOpen(!templatesOpen)}
            >
              Templates
            </SecondaryButton>

            {templatesOpen && (
              <Box
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  backgroundColor: colors.frenchVanilla100,
                  border: `1px solid ${colors.soap300}`,
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  minWidth: 280,
                  maxHeight: 400,
                  overflowY: 'auto',
                }}
              >
                {RECRUITING_EMAIL_TEMPLATES.map((template) => (
                  <Box
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${colors.soap200}`,
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.soap100;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <BodyText size="small" fontWeight="bold" style={{ marginBottom: 4 }}>
                      {template.name}
                    </BodyText>
                    <BodyText size="small" color="hint">
                      {template.subject}
                    </BodyText>
                  </Box>
                ))}
              </Box>
            )}
          </div>
        )}
      </Flex>
    </Flex>
  );

  return (
    <Box
      style={{
        position: 'relative',
        width: '100%',
        minWidth: 0,
        ...(composeLayout
          ? quotedNaturalHeight
            ? {
                flex: '0 1 auto',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }
            : {
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
              }
          : {}),
      }}
    >
      {composeLayout ? composeToolbar : simpleToolbar}

      {slotBelowToolbar}

      {genAILoading && (
        <Flex
          justifyContent="center"
          alignItems="center"
          gap="s"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            borderRadius: composeLayout ? 0 : 12,
            zIndex: 999,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              border: `3px solid ${colors.soap300}`,
              borderTop: `3px solid ${colors.blueberry400}`,
              borderRadius: '50%',
              animation: 'rte-spin 1s linear infinite',
            }}
          />
          <BodyText size="small" color="hint">
            Improving with GenAI...
          </BodyText>
        </Flex>
      )}

      {composeLayout ? (
        <Box
          style={{
            backgroundColor: canvasBackgroundColor,
            padding: 16,
            width: '100%',
            boxSizing: 'border-box',
            ...(quotedNaturalHeight
              ? {
                  flex: '0 1 auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }
              : {
                  flex: 1,
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }),
          }}
        >
          <Box
            style={{
              width: '100%',
              ...(quotedNaturalHeight
                ? {
                    flex: '0 1 auto',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }
                : {
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }),
            }}
          >
            {composeQuotedThread ? (
              <Box
                style={{
                  width: '100%',
                  maxWidth: devicePreview === 'mobile' ? 375 : '100%',
                  marginLeft: devicePreview === 'mobile' ? 'auto' : undefined,
                  marginRight: devicePreview === 'mobile' ? 'auto' : undefined,
                  ...(quotedNaturalHeight
                    ? {
                        flex: '0 0 auto',
                        overflow: 'visible',
                      }
                    : {
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                      }),
                  display: 'flex',
                  flexDirection: 'column',
                  border: `1px solid ${colors.soap300}`,
                  borderRadius: 6,
                  backgroundColor: colors.frenchVanilla100,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  data-placeholder={placeholder}
                  onInput={() => emitInput()}
                  style={{
                    ...sanaCommFormControlStyle(),
                    backgroundColor: colors.frenchVanilla100,
                    border: 'none',
                    borderRadius: 0,
                    width: '100%',
                    flexGrow: 0,
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    minHeight,
                    ...(quotedNaturalHeight
                      ? { maxHeight: 'none', overflowY: 'visible' }
                      : { maxHeight: Math.min(maxHeight, 320), overflowY: 'auto' }),
                    padding: 16,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <div
                  role="note"
                  aria-label="Quoted conversation"
                  contentEditable={false}
                  tabIndex={-1}
                  style={{
                    flex: '0 0 auto',
                    width: '100%',
                    minHeight: 120,
                    borderTop: `1px solid ${colors.soap300}`,
                    padding: '20px 16px 16px',
                    backgroundColor: colors.frenchVanilla100,
                    overflowY: 'visible',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  {composeQuotedThread}
                </div>
              </Box>
            ) : (
              editorInner
            )}
          </Box>
        </Box>
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={(e: React.FormEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            onChange(target.innerHTML, plainTextFromContentEditable(target));
          }}
          style={{
            ...sanaCommFormControlStyle(),
            width: '100%',
            minHeight,
            maxHeight,
            padding: 12,
            borderRadius: '0 0 12px 12px',
            overflowY: 'auto',
            outline: 'none',
          }}
        />
      )}

      <style>{`
        @keyframes rte-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};
