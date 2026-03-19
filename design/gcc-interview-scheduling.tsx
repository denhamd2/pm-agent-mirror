import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { Select } from '@workday/canvas-kit-react/select';
import { Checkbox } from '@workday/canvas-kit-react/checkbox';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { checkIcon, xIcon, infoIcon } from '@workday/canvas-system-icons-web';
import { colors, space } from '@workday/canvas-kit-react/tokens';

interface Interviewer {
  id: string;
  name: string;
  role: string;
  nationality: string;
  isSaudiNational: boolean;
}

interface ComplianceStatus {
  ksaPanelRule: boolean;
  kuwaitNotice: boolean;
  emiratisationTracking: boolean;
}

export const GCCInterviewScheduling: React.FC = () => {
  const [requisitionId] = useState('REQ-2024-00542');
  const [requisitionTitle] = useState('Senior Engineer - Riyadh');
  const [entity] = useState('Saudi Arabia');
  const [candidateName] = useState('Ahmed Al-Rashid');
  const [candidateLocation, setCandidateLocation] = useState('Riyadh');
  
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [interviewDate, setInterviewDate] = useState('');
  const [showScheduleConfirmation, setShowScheduleConfirmation] = useState(false);

  // Mock interviewer data
  const availableInterviewers: Interviewer[] = [
    { id: '1', name: 'Fahad Al-Mutairi', role: 'Engineering Manager', nationality: 'Saudi', isSaudiNational: true },
    { id: '2', name: 'Sarah Chen', role: 'Senior Engineer', nationality: 'Singapore', isSaudiNational: false },
    { id: '3', name: 'Mohammed Al-Saud', role: 'Tech Lead', nationality: 'Saudi', isSaudiNational: true },
    { id: '4', name: 'David Martinez', role: 'Principal Engineer', nationality: 'Spain', isSaudiNational: false },
  ];

  // Calculate compliance status
  const calculateCompliance = (): ComplianceStatus => {
    const selectedPanelists = availableInterviewers.filter(i => selectedInterviewers.includes(i.id));
    const saudiCount = selectedPanelists.filter(i => i.isSaudiNational).length;
    const totalCount = selectedPanelists.length;
    
    // KSA Panel Rule: ≥50% Saudi nationals
    const ksaPanelRule = totalCount > 0 && (saudiCount / totalCount) >= 0.5;
    
    // Kuwait Notice: 3-day minimum
    const kuwaitNotice = candidateLocation !== 'Kuwait' || 
      (interviewDate && new Date(interviewDate).getTime() - Date.now() >= 3 * 24 * 60 * 60 * 1000);
    
    // Emiratisation tracking (placeholder)
    const emiratisationTracking = entity !== 'UAE' || selectedPanelists.some(i => i.nationality === 'Emirati');

    return { ksaPanelRule, kuwaitNotice, emiratisationTracking };
  };

  const compliance = calculateCompliance();
  const allCompliant = compliance.ksaPanelRule && compliance.kuwaitNotice;

  const handleScheduleInterview = () => {
    if (allCompliant && selectedInterviewers.length > 0 && interviewDate) {
      setShowScheduleConfirmation(true);
    }
  };

  const ComplianceIndicator: React.FC<{ label: string; status: boolean; required: boolean }> = ({ label, status, required }) => (
    <Flex alignItems="center" gap="xs" marginBottom="xs">
      <SystemIcon 
        icon={status ? checkIcon : xIcon} 
        size={16} 
        color={status ? colors.greenApple600 : (required ? colors.cantaloupe600 : colors.blackPepper400)} 
      />
      <BodyText size="small" color={status ? colors.greenApple600 : (required ? colors.cantaloupe600 : colors.blackPepper600)}>
        {label}
      </BodyText>
    </Flex>
  );

  if (showScheduleConfirmation) {
    return (
      <Box padding="xxl" style={{ maxWidth: 800, margin: '0 auto' }}>
        <Card padding="l">
          <Flex direction="column" gap="l" alignItems="center">
            <SystemIcon icon={checkIcon} size={48} color={colors.greenApple600} />
            <Heading size="large">Interview Scheduled Successfully</Heading>
            <BodyText>
              Interview for {candidateName} has been scheduled with GCC compliance verified.
            </BodyText>
            
            <Box width="100%" marginTop="m">
              <Card padding="m" style={{ backgroundColor: colors.soap100 }}>
                <Heading size="small" marginBottom="s">Compliance Summary</Heading>
                <ComplianceIndicator label="KSA Panel Rule: ≥50% Saudi nationals" status={true} required={true} />
                <ComplianceIndicator label="Kuwait 3-day notice: Verified" status={true} required={candidateLocation === 'Kuwait'} />
                <BodyText size="small" marginTop="s">
                  Panel: {availableInterviewers.filter(i => selectedInterviewers.includes(i.id)).map(i => i.name).join(', ')}
                </BodyText>
                <BodyText size="small">
                  Date: {new Date(interviewDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </BodyText>
              </Card>
            </Box>

            <Flex gap="s" marginTop="l">
              <SecondaryButton onClick={() => setShowScheduleConfirmation(false)}>Schedule Another</SecondaryButton>
              <TertiaryButton>View Calendar</TertiaryButton>
            </Flex>
          </Flex>
        </Card>
      </Box>
    );
  }

  return (
    <Box padding="xl" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Heading size="large" marginBottom="m">Schedule Interview with GCC Compliance</Heading>
      
      <Flex gap="l" style={{ flexWrap: 'wrap' }}>
        {/* Left Column: Requisition & Candidate Info */}
        <Box flex="1" minWidth="400px">
          <Card padding="l" marginBottom="l">
            <Heading size="medium" marginBottom="m">Requisition Details</Heading>
            <Flex direction="column" gap="m">
              <Box>
                <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }}>Requisition ID</BodyText>
                <BodyText>{requisitionId}</BodyText>
              </Box>
              <Box>
                <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }}>Position</BodyText>
                <BodyText>{requisitionTitle}</BodyText>
              </Box>
              <Box>
                <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }}>Entity</BodyText>
                <BodyText>{entity}</BodyText>
              </Box>
              <Box>
                <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }}>Candidate</BodyText>
                <BodyText>{candidateName}</BodyText>
              </Box>
              <Box>
                <BodyText size="small" style={{ fontWeight: 600, color: colors.blackPepper600 }} marginBottom="xs">Candidate Location</BodyText>
                <Select 
                  value={candidateLocation} 
                  onChange={(e) => setCandidateLocation(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Riyadh">Riyadh, Saudi Arabia</option>
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="Kuwait">Kuwait City, Kuwait</option>
                  <option value="Doha">Doha, Qatar</option>
                </Select>
              </Box>
            </Flex>
          </Card>

          <Card padding="l">
            <Heading size="medium" marginBottom="m">Interview Date</Heading>
            <BodyText size="small" marginBottom="s">Select interview date (minimum 3 days for Kuwait candidates)</BodyText>
            <TextInput
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              style={{ width: '100%' }}
              min={new Date(Date.now() + (candidateLocation === 'Kuwait' ? 3 : 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            />
            {candidateLocation === 'Kuwait' && (
              <Flex alignItems="center" gap="xs" marginTop="s" padding="s" style={{ backgroundColor: colors.cantaloupe100, borderRadius: 4 }}>
                <SystemIcon icon={infoIcon} size={16} color={colors.cantaloupe600} />
                <BodyText size="small" color={colors.cantaloupe600}>
                  Kuwait labour law requires 3-day notice. Earliest date: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </BodyText>
              </Flex>
            )}
          </Card>
        </Box>

        {/* Right Column: Interview Panel & Compliance */}
        <Box flex="1" minWidth="400px">
          <Card padding="l" marginBottom="l">
            <Heading size="medium" marginBottom="m">Select Interview Panel</Heading>
            <BodyText size="small" marginBottom="m">
              Saudi entity requires ≥50% Saudi nationals on panel (Nitaqat compliance)
            </BodyText>
            
            {availableInterviewers.map((interviewer) => (
              <Box 
                key={interviewer.id} 
                marginBottom="s" 
                padding="s" 
                style={{ 
                  border: `1px solid ${selectedInterviewers.includes(interviewer.id) ? colors.blueberry500 : colors.soap300}`,
                  borderRadius: 4,
                  backgroundColor: selectedInterviewers.includes(interviewer.id) ? colors.blueberry100 : 'white',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (selectedInterviewers.includes(interviewer.id)) {
                    setSelectedInterviewers(selectedInterviewers.filter(id => id !== interviewer.id));
                  } else {
                    setSelectedInterviewers([...selectedInterviewers, interviewer.id]);
                  }
                }}
              >
                <Flex alignItems="center" gap="s">
                  <Checkbox 
                    checked={selectedInterviewers.includes(interviewer.id)}
                    onChange={() => {}}
                  />
                  <Box flex="1">
                    <Flex justifyContent="space-between" alignItems="center">
                      <Box>
                        <BodyText style={{ fontWeight: 600 }}>{interviewer.name}</BodyText>
                        <BodyText size="small" color={colors.blackPepper400}>{interviewer.role}</BodyText>
                      </Box>
                      {interviewer.isSaudiNational && (
                        <Box 
                          padding="xxs" 
                          paddingX="xs" 
                          style={{ 
                            backgroundColor: colors.greenApple100, 
                            borderRadius: 4 
                          }}
                        >
                          <BodyText size="small" color={colors.greenApple600} style={{ fontWeight: 600 }}>
                            Saudi National
                          </BodyText>
                        </Box>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Card>

          <Card padding="l" style={{ 
            backgroundColor: allCompliant ? colors.greenApple100 : colors.cantaloupe100,
            border: `2px solid ${allCompliant ? colors.greenApple600 : colors.cantaloupe600}`
          }}>
            <Heading size="medium" marginBottom="m">GCC Compliance Status</Heading>
            
            <ComplianceIndicator 
              label={`KSA Panel Rule: ${selectedInterviewers.length > 0 ? 
                `${availableInterviewers.filter(i => selectedInterviewers.includes(i.id) && i.isSaudiNational).length}/${selectedInterviewers.length} Saudi nationals (${Math.round((availableInterviewers.filter(i => selectedInterviewers.includes(i.id) && i.isSaudiNational).length / selectedInterviewers.length) * 100)}%)` : 
                'Select panel members'}`}
              status={compliance.ksaPanelRule}
              required={true}
            />
            
            <ComplianceIndicator 
              label={candidateLocation === 'Kuwait' ? 
                `Kuwait 3-day notice: ${interviewDate ? 
                  (new Date(interviewDate).getTime() - Date.now() >= 3 * 24 * 60 * 60 * 1000 ? 'Compliant' : 'Non-compliant') : 
                  'Select date'}` : 
                'Kuwait notice: Not applicable'}
              status={compliance.kuwaitNotice}
              required={candidateLocation === 'Kuwait'}
            />

            {!allCompliant && selectedInterviewers.length > 0 && (
              <Box marginTop="m" padding="s" style={{ backgroundColor: 'white', borderRadius: 4 }}>
                <BodyText size="small" color={colors.cantaloupe600}>
                  ⚠️ Interview cannot be scheduled until all compliance requirements are met.
                </BodyText>
              </Box>
            )}
          </Card>

          <Flex gap="s" marginTop="l" justifyContent="flex-end">
            <SecondaryButton>Cancel</SecondaryButton>
            <PrimaryButton 
              onClick={handleScheduleInterview}
              disabled={!allCompliant || selectedInterviewers.length === 0 || !interviewDate}
            >
              Schedule Interview
            </PrimaryButton>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default GCCInterviewScheduling;
