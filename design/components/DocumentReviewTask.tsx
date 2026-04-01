/**
 * DocumentReviewTask
 * 
 * Offer document review task content with pre-Adobe consent and post-Adobe confirmation states
 * 
 * Use for: Offer document signing, consent workflows, Adobe Sign integration
 * 
 * **Pattern**: Two-state component (pre-Adobe consent, post-Adobe confirmation) with error handling
 * 
 * **Copy**: PASS 2.5 approved (319 + 060). Do not change without new 319 pass.
 */

import React, { useState } from 'react';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { Banner } from '@workday/canvas-kit-react/banner';
import { colors } from '@workday/canvas-kit-react/tokens';

import { SANA_CARD_SHADOW, SANA_CARD_RADIUS_LG, cardStyle } from './index';

export type CandidateErrorKind = 'none' | 'adobe' | 'envelope' | 'consent' | 'incomplete';

export interface DocumentReviewTaskProps {
  preAdobe?: boolean;
  orgName: string;
  onOpenAdobe: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

/** 319 + 060 draft copy — PASS 2.5; do not change without new 319 pass */
export function createDocumentReviewCopy(orgName: string) {
  return {
    pageTitleCandidate: 'Almost done',
    leadCandidate:
      "You've finished signing in Adobe Sign. Select the button below to complete this step in Workday and close your Recruiting task.",
    primaryCandidate: 'Confirm and complete in Workday',
    secondaryCandidate: 'Open Adobe Sign again',
    backInbox: 'Back to inbox',
    linkHelp: 'Learn how Adobe Sign works with Workday',
    consentAadhaar: `I agree to use Aadhaar e-authentication for this offer, as provided by Adobe Sign for ${orgName}, and I understand this is separate from signing the document.`,
    consentESign: `I agree to sign this offer and related documents electronically in Adobe Sign for ${orgName}.`,
    privacyBlock: `${orgName} decides why and how your information is used for this offer. Workday hosts this task; Adobe Sign presents the documents and authentication steps. For details, see the privacy information ${orgName} provides to you.`,
    retentionFooter: `Authentication and signing metadata may be retained for up to 30 days for this integration where your organisation's settings and applicable law allow, unless a different period is stated in ${orgName}'s privacy notice.`,
    errAdobeUnavailable:
      "We can't reach Adobe Sign right now. Check your connection, try again, or contact your recruiter if the problem continues.",
    errEnvelopeExpired: 'This signing request has expired. Contact your recruiter to resend the offer documents.',
    errConsent: 'Confirm both items above to continue.',
    errAdobeIncomplete: 'Finish signing and authentication in Adobe Sign, then return here to complete this task.',
    successCandidate: "You've completed this step in Workday.",
    loadingStatus: 'Checking signature status…',
    prototypeNote:
      'Prototype surfaces use PASS 2.5 copy; consent and retention are draft for counsel review.',
  } as const;
}

function shellCardStyle() {
  return {
    ...cardStyle(),
    boxShadow: SANA_CARD_SHADOW,
    borderRadius: SANA_CARD_RADIUS_LG,
  };
}

function LinkText({ children, href = '#' }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      style={{
        color: colors.blueberry400,
        fontSize: 14,
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
    >
      {children}
    </a>
  );
}

export const DocumentReviewTask: React.FC<DocumentReviewTaskProps> = ({
  preAdobe: initialPreAdobe = true,
  orgName,
  onOpenAdobe,
  onComplete,
  onCancel,
}) => {
  const [aadhaar, setAadhaar] = useState(!initialPreAdobe);
  const [eSign, setESign] = useState(!initialPreAdobe);
  const [errorKind, setErrorKind] = useState<CandidateErrorKind>('none');
  const [preAdobe, setPreAdobe] = useState(initialPreAdobe);

  const COPY = createDocumentReviewCopy(orgName);

  const onPrimary = () => {
    setErrorKind('none');
    if (!aadhaar || !eSign) {
      setErrorKind('consent');
      return;
    }
    onComplete();
  };

  return (
    <Card padding="xl" style={{ ...shellCardStyle(), width: 600, maxHeight: '90vh', overflowY: 'auto' }}>
      {preAdobe ? (
        <>
          <Heading size="large" marginBottom="m">
            Review document
          </Heading>
          <BodyText size="medium" marginBottom="m">
            Please review and sign your offer documents. You will be redirected to Adobe Sign to complete the electronic signature process using Aadhaar e-authentication.
          </BodyText>
          
          <Flex flexDirection="column" gap="m" marginBottom="m">
            <Checkbox
              id="consent-aadhaar-pre"
              checked={aadhaar}
              label={COPY.consentAadhaar}
              onChange={(e) => setAadhaar(e.target.checked)}
            />
            <Checkbox
              id="consent-esign-pre"
              checked={eSign}
              label={COPY.consentESign}
              onChange={(e) => setESign(e.target.checked)}
            />
          </Flex>

          <BodyText size="small" color="blackPepper600" marginBottom="l">
            {COPY.privacyBlock}
          </BodyText>

          <Flex gap="s" flexWrap="wrap" marginBottom="m">
            <PrimaryButton 
              onClick={() => {
                if (!aadhaar || !eSign) {
                  setErrorKind('consent');
                  return;
                }
                setErrorKind('none');
                setPreAdobe(false);
                onOpenAdobe();
              }}
            >
              Open in Adobe Sign
            </PrimaryButton>
            <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          </Flex>
          
          {errorKind === 'consent' && (
            <Banner hasError marginBottom="m" style={{ width: '100%' }}>
              <Banner.Icon />
              <Banner.Label>{COPY.errConsent}</Banner.Label>
            </Banner>
          )}

          <BodyText size="small" color="blackPepper600" marginBottom="l">
            {COPY.retentionFooter}
          </BodyText>
        </>
      ) : (
        <>
          <Heading size="large" marginBottom="m">
            {COPY.pageTitleCandidate}
          </Heading>
          <BodyText size="medium" marginBottom="m">
            {COPY.leadCandidate}
          </BodyText>

          {errorKind === 'adobe' && (
            <Banner hasError marginBottom="m" style={{ width: '100%' }}>
              <Banner.Icon />
              <Banner.Label>{COPY.errAdobeUnavailable}</Banner.Label>
            </Banner>
          )}
          {errorKind === 'envelope' && (
            <Banner hasError marginBottom="m" style={{ width: '100%' }}>
              <Banner.Icon />
              <Banner.Label>{COPY.errEnvelopeExpired}</Banner.Label>
            </Banner>
          )}
          {errorKind === 'consent' && (
            <Banner hasError marginBottom="m" style={{ width: '100%' }}>
              <Banner.Icon />
              <Banner.Label>{COPY.errConsent}</Banner.Label>
            </Banner>
          )}
          {errorKind === 'incomplete' && (
            <Banner hasError marginBottom="m" style={{ width: '100%' }}>
              <Banner.Icon />
              <Banner.Label>{COPY.errAdobeIncomplete}</Banner.Label>
            </Banner>
          )}

          <Flex flexDirection="column" gap="m" marginBottom="m">
            <Checkbox
              id="consent-aadhaar"
              checked={aadhaar}
              label={COPY.consentAadhaar}
              onChange={(e) => setAadhaar(e.target.checked)}
            />
            <Checkbox
              id="consent-esign"
              checked={eSign}
              label={COPY.consentESign}
              onChange={(e) => setESign(e.target.checked)}
            />
          </Flex>

          <BodyText size="small" color="blackPepper600" marginBottom="l">
            {COPY.privacyBlock}
          </BodyText>

          <Flex gap="s" flexWrap="wrap" marginBottom="m">
            <PrimaryButton onClick={onPrimary}>{COPY.primaryCandidate}</PrimaryButton>
            <SecondaryButton onClick={onOpenAdobe}>{COPY.secondaryCandidate}</SecondaryButton>
          </Flex>
          <Flex gap="s" flexWrap="wrap" marginBottom="l">
            <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          </Flex>
          <BodyText size="medium" marginBottom="l">
            <LinkText>{COPY.linkHelp}</LinkText>
          </BodyText>
          <BodyText size="small" color="blackPepper600" marginBottom="l">
            {COPY.retentionFooter}
          </BodyText>
          <BodyText size="small" color="blackPepper500" marginBottom="m">
            {COPY.loadingStatus}
          </BodyText>
          <BodyText size="small" fontWeight="bold" marginBottom="xs">
            Prototype: error strings (PASS 2.5)
          </BodyText>
          <Flex gap="s" flexWrap="wrap">
            <SecondaryButton size="small" onClick={() => setErrorKind('adobe')}>
              Show Adobe unavailable
            </SecondaryButton>
            <SecondaryButton size="small" onClick={() => setErrorKind('envelope')}>
              Show envelope expired
            </SecondaryButton>
            <SecondaryButton size="small" onClick={() => setErrorKind('incomplete')}>
              Show Adobe incomplete
            </SecondaryButton>
            <SecondaryButton size="small" onClick={() => setErrorKind('none')}>
              Clear banner
            </SecondaryButton>
          </Flex>
        </>
      )}
    </Card>
  );
};
