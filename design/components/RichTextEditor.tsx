import React, { useEffect, useState, useRef } from 'react';
import { SecondaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { colors } from '@workday/canvas-kit-react/tokens';
import { BodyText } from '@workday/canvas-kit-react/text';
import {
  boldIcon,
  italicsIcon,
  underlineIcon,
  linkIcon,
  unorderedListIcon,
  chevronDownIcon,
  starIcon,
} from '@workday/canvas-system-icons-web';
import { sanaCommFormControlStyle } from './SanaCommPanelPatterns';

// Recruiting email templates with token system
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
  showTemplates?: boolean;
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
}

/**
 * Standalone rich text editor with functional formatting toolbar.
 * 
 * Features:
 * - contentEditable div with data-placeholder pattern (CSS injection via useEffect)
 * - Formatting toolbar: Bold, Italic, Underline, Link, Bulleted list
 * - Templates: 6 recruiting email templates with token system ({{candidateName}}, etc.)
 * - GenAI: Mock text improvement with realistic loading state
 * - Sana form control styling (white bg, 12px radius, soap300 border, link-color focus)
 * - Returns both HTML and plain text via onChange
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Type here...',
  minHeight = 240,
  maxHeight = 400,
  showTemplates = false,
  showGenAI = false,
  candidateData = {},
}) => {
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [genAILoading, setGenAILoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);

  // Inject CSS for data-placeholder attribute
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      [contenteditable][data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: ${colors.blackPepper400};
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Close templates menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        templatesRef.current &&
        !templatesRef.current.contains(e.target as Node)
      ) {
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

  // Replace tokens in template with candidate data
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

  // Apply template to editor
  const applyTemplate = (template: EmailTemplate) => {
    const bodyWithTokens = replaceTokens(template.body);
    const htmlContent = bodyWithTokens.replace(/\n/g, '<br>');
    
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
      onChange(htmlContent, bodyWithTokens);
    }
    setTemplatesOpen(false);
  };

  // Mock GenAI improvement with realistic transformations
  const improveWithGenAI = async () => {
    if (!editorRef.current || genAILoading) return;
    
    const currentText = editorRef.current.textContent || '';
    if (!currentText.trim()) return;

    setGenAILoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Pattern-based transformations for realistic demo
    let improved = currentText;

    // Pattern 1: Short casual message
    if (currentText.length < 100 && /hi|hey|hello/i.test(currentText)) {
      improved = `Hi ${candidateData.firstName || '{{candidateFirstName}}'},

Thank you for your application. ${currentText.replace(/^(hi|hey|hello)[,\s]*/i, '')}

Please let me know if you have any questions.

Best regards,
${candidateData.recruiterName || '{{recruiterName}}'}`;
    }
    // Pattern 2: Missing greeting/closing
    else if (!/^(hi|hello|dear)/i.test(currentText) || !/regards|thanks|sincerely/i.test(currentText)) {
      improved = `Hi ${candidateData.firstName || '{{candidateFirstName}}'},

${currentText}

Best regards,
${candidateData.recruiterName || '{{recruiterName}}'}`;
    }
    // Pattern 3: Expand brief message
    else if (currentText.length < 150) {
      improved = currentText
        .replace(/\bthx\b/gi, 'Thank you')
        .replace(/\bpls\b/gi, 'please')
        .replace(/\bu\b/gi, 'you')
        .replace(/\basap\b/gi, 'as soon as possible');
      
      if (improved === currentText) {
        // Fallback: add professional framing
        improved = `${improved}\n\nIf you have any questions or need clarification, please don't hesitate to reach out. I'm happy to help.`;
      }
    }
    // Pattern 4: Already professional - minor enhancements
    else {
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

  return (
    <Box style={{ position: 'relative' }}>
      {/* Formatting Toolbar */}
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
            onClick={() => document.execCommand('bold', false)}
          />
          <ToolbarIconButton
            icon={italicsIcon}
            aria-label="Italic"
            onClick={() => document.execCommand('italic', false)}
          />
          <ToolbarIconButton
            icon={underlineIcon}
            aria-label="Underline"
            onClick={() => document.execCommand('underline', false)}
          />
          <ToolbarIconButton
            icon={linkIcon}
            aria-label="Link"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) document.execCommand('createLink', false, url);
            }}
          />
          <ToolbarIconButton
            icon={unorderedListIcon}
            aria-label="Bulleted list"
            onClick={() => document.execCommand('insertUnorderedList', false)}
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
              
              {/* Templates Dropdown Menu */}
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

      {/* GenAI Loading Overlay */}
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
            borderRadius: 12,
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
              animation: 'spin 1s linear infinite',
            }}
          />
          <BodyText size="small" color="hint">
            Improving with GenAI...
          </BodyText>
        </Flex>
      )}

      {/* Rich Text Input (contentEditable) */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e: React.FormEvent<HTMLDivElement>) => {
          const target = e.currentTarget;
          const htmlContent = target.innerHTML;
          const textContent = target.textContent || '';
          onChange(htmlContent, textContent);
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

      {/* Inject keyframes for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};
