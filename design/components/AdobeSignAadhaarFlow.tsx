/**
 * AdobeSignAadhaarFlow
 * 
 * 4-step Adobe Sign simulation with NSDL e-Gov Aadhaar authentication
 * 
 * Use for: Offer signing, document authentication, Aadhaar-based e-signatures
 * 
 * **Pattern**: Self-contained external flow simulation with internal state management
 * 
 * Steps:
 * 1. NSDL consent
 * 2. Aadhaar number / VID entry
 * 3. OTP verification
 * 4. Success confirmation
 */

import React, { useState } from 'react';
import { Card } from '@workday/canvas-kit-react/card';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { dotIcon } from '@workday/canvas-system-icons-web';
import { colors } from '@workday/canvas-kit-react/tokens';

import { SANA_CARD_SHADOW, SANA_CARD_RADIUS_LG, cardStyle } from './index';

export interface AdobeSignAadhaarFlowProps {
  open: boolean;
  onComplete: () => void;
  orgName?: string;
}

function shellCardStyle() {
  return {
    ...cardStyle(),
    boxShadow: SANA_CARD_SHADOW,
    borderRadius: SANA_CARD_RADIUS_LG,
  };
}

export const AdobeSignAadhaarFlow: React.FC<AdobeSignAadhaarFlowProps> = ({
  open,
  onComplete,
  orgName = 'Acme Corporation',
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [aadhaarNum, setAadhaarNum] = useState('');
  const [otp, setOtp] = useState('');
  const [nsdlConsent, setNsdlConsent] = useState(false);

  if (!open) return null;

  return (
    <Box 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: '#323232', 
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Simulated Document Background */}
      <Card style={{ width: 800, height: '90vh', backgroundColor: '#fff', position: 'relative' }}>
        <Box padding="xl" style={{ opacity: 0.5 }}>
          <Heading size="medium" marginBottom="l">Offer Letter</Heading>
          <Box style={{ height: 16, backgroundColor: '#eee', marginBottom: 8, width: '100%' }} />
          <Box style={{ height: 16, backgroundColor: '#eee', marginBottom: 8, width: '100%' }} />
          <Box style={{ height: 16, backgroundColor: '#eee', marginBottom: 8, width: '80%' }} />
        </Box>

        {/* Simulated Aadhaar Modal */}
        <Box style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Card padding="xl" style={{ ...shellCardStyle(), width: 500, backgroundColor: '#fff' }}>
            {step === 1 && (
              <>
                <Heading size="medium" marginBottom="m">Electronic Signature Service</Heading>
                <BodyText size="small" color="blackPepper600" marginBottom="l">
                  Provided by NSDL e-Gov (Authorized ASP)
                </BodyText>
                <Box marginBottom="m">
                  <Checkbox
                    id="nsdl-terms"
                    checked={nsdlConsent}
                    onChange={(e) => setNsdlConsent(e.target.checked)}
                    label="I hereby authorize NSDL e-Governance Infrastructure Limited to use my Aadhaar details for e-Sign authentication."
                  />
                </Box>
                <Flex justifyContent="flex-end" gap="s">
                  <PrimaryButton onClick={() => setStep(2)} disabled={!nsdlConsent}>Accept & Continue</PrimaryButton>
                </Flex>
              </>
            )}

            {step === 2 && (
              <>
                <Heading size="medium" marginBottom="m">Aadhaar Authentication</Heading>
                <BodyText size="small" marginBottom="m">Enter your Virtual ID (VID) or Aadhaar Number to receive an OTP on your linked mobile.</BodyText>
                <FormField>
                  <FormField.Label>VID / Aadhaar Number</FormField.Label>
                  <FormField.Input 
                    as="input" 
                    type="text" 
                    value={aadhaarNum} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAadhaarNum(e.target.value)} 
                    placeholder="XXXX XXXX XXXX"
                    style={{ width: '100%', padding: '8px 12px', border: `1px solid ${colors.soap400}`, borderRadius: 4 }}
                  />
                </FormField>
                <Flex justifyContent="flex-end" gap="s" marginTop="l">
                  <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
                  <PrimaryButton onClick={() => setStep(3)} disabled={!aadhaarNum}>Get OTP</PrimaryButton>
                </Flex>
              </>
            )}

            {step === 3 && (
              <>
                <Heading size="medium" marginBottom="m">Verify OTP</Heading>
                <BodyText size="small" marginBottom="m">Enter the OTP sent to your Aadhaar-linked mobile number.</BodyText>
                <FormField>
                  <FormField.Label>One-Time Password</FormField.Label>
                  <FormField.Input 
                    as="input" 
                    type="text" 
                    value={otp} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)} 
                    placeholder="XXXXXX"
                    style={{ width: '100%', padding: '8px 12px', border: `1px solid ${colors.soap400}`, borderRadius: 4 }}
                  />
                </FormField>
                <Flex justifyContent="flex-end" gap="s" marginTop="l">
                  <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
                  <PrimaryButton onClick={() => setStep(4)} disabled={!otp}>Verify & Sign</PrimaryButton>
                </Flex>
              </>
            )}

            {step === 4 && (
              <Flex flexDirection="column" alignItems="center" padding="l">
                <SystemIcon icon={dotIcon} size={48} color={colors.greenApple500} />
                <Heading size="medium" marginTop="m" marginBottom="s">Document Signed Successfully</Heading>
                <BodyText size="small" color="blackPepper600" marginBottom="l" style={{ textAlign: 'center' }}>
                  Your document has been electronically signed using Aadhaar e-Sign. You will now be redirected back to Workday.
                </BodyText>
                <PrimaryButton onClick={onComplete}>Return to Workday</PrimaryButton>
              </Flex>
            )}
          </Card>
        </Box>
      </Card>
    </Box>
  );
};
