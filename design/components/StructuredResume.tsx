/**
 * StructuredResume
 * 
 * Displays parsed resume with sections: Experience, Skills, Education, Certifications
 * Extracted from Figma Candidate Smart View - right panel structured resume display
 * 
 * Usage:
 * <StructuredResume 
 *   candidateName="David Martinez"
 *   title="Senior Frontend Developer"
 *   location="New York, NY"
 *   email="david.martinez@example.com"
 *   bio="Creative and detail-oriented frontend developer..."
 *   experience={[...]}
 *   skills={['React', 'TypeScript', 'CSS']}
 *   education={['BS Computer Science, NYU']}
 *   certifications={['Meta Frontend Developer Professional Certificate']}
 * />
 */

import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { colors, space } from '@workday/canvas-kit-react/tokens';

export interface ResumeEntry {
  title: string;
  company: string;
  dateRange: string;
  bullets: string[];
  isCurrent?: boolean;
}

export interface StructuredResumeProps {
  candidateName: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  experience: ResumeEntry[];
  skills: string[];
  education: string[];
  certifications: string[];
}

export function StructuredResume({
  candidateName,
  title,
  location,
  email,
  bio,
  experience,
  skills,
  education,
  certifications,
}: StructuredResumeProps) {
  // #region agent log
  fetch('http://127.0.0.1:7559/ingest/aed26437-7f30-4964-80c9-2b9b6574b106',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6c1e8b'},body:JSON.stringify({sessionId:'6c1e8b',location:'StructuredResume.tsx:57',message:'StructuredResume render',data:{candidateName,experienceCount:experience?.length||0,skillsCount:skills?.length||0},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  return (
    <Flex flexDirection="column" gap="l">
      {/* Header */}
      <Box>
        <Heading size="large" marginBottom="xxs">
          {candidateName}
        </Heading>
        <BodyText size="medium" color="blackPepper600" marginBottom="xxs">
          {title}
        </BodyText>
        <BodyText size="small" color="blackPepper500">
          {location} · {email}
        </BodyText>
      </Box>

      {/* Bio */}
      {bio && (
        <Box>
          <BodyText size="small">{bio}</BodyText>
        </Box>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <Box>
          <Heading 
            size="small" 
            marginBottom="m"
            style={{ 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: colors.blackPepper600,
            }}
          >
            EXPERIENCE
          </Heading>
          <Flex flexDirection="column" gap="l">
            {experience.map((entry, idx) => (
              <Box key={idx}>
                <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="xs">
                  <Box flex={1}>
                    <Heading size="small" marginBottom="xxs">
                      {entry.title}
                    </Heading>
                    <BodyText size="small" color="blackPepper600">
                      {entry.company}
                    </BodyText>
                  </Box>
                  <BodyText size="small" color="blackPepper500" style={{ whiteSpace: 'nowrap' }}>
                    {entry.dateRange}
                  </BodyText>
                </Flex>
                {entry.bullets && entry.bullets.length > 0 && (
                  <Box marginLeft="m">
                    {entry.bullets.map((bullet, bulletIdx) => (
                      <BodyText key={bulletIdx} size="small" marginBottom="xs">
                        • {bullet}
                      </BodyText>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Flex>
        </Box>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <Box>
          <Heading 
            size="small" 
            marginBottom="m"
            style={{ 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: colors.blackPepper600,
            }}
          >
            SKILLS
          </Heading>
          <Flex flexWrap="wrap" gap="xs">
            {skills.map((skill) => (
              <StatusIndicator
                key={skill}
                type={StatusIndicator.Type.Gray}
                emphasis={StatusIndicator.Emphasis.Low}
                label={skill}
              />
            ))}
          </Flex>
        </Box>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <Box>
          <Heading 
            size="small" 
            marginBottom="m"
            style={{ 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: colors.blackPepper600,
            }}
          >
            EDUCATION
          </Heading>
          <Flex flexDirection="column" gap="xs">
            {education.map((edu, idx) => (
              <BodyText key={idx} size="small">
                {edu}
              </BodyText>
            ))}
          </Flex>
        </Box>
      )}

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <Box>
          <Heading 
            size="small" 
            marginBottom="m"
            style={{ 
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: colors.blackPepper600,
            }}
          >
            CERTIFICATIONS
          </Heading>
          <Flex flexDirection="column" gap="xs">
            {certifications.map((cert, idx) => (
              <BodyText key={idx} size="small">
                {cert}
              </BodyText>
            ))}
          </Flex>
        </Box>
      )}
    </Flex>
  );
}
