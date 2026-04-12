import React from 'react';
import { Select } from '@workday/canvas-kit-react/select';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { Card } from '@workday/canvas-kit-react/card';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { checkSmallIcon } from '@workday/canvas-system-icons-web';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Avatar } from '@workday/canvas-kit-react/avatar';
import {
  SanaCommMessageBubble,
  SanaCommComposer,
  SANA_COMM_PANEL_SURFACE,
  SANA_COMM_BUBBLE_BG,
  SANA_COMM_MESSAGE_RADIUS_PX,
  CareerSiteHero,
  JobCard,
  JobDetailsStickyFooter,
  CandidateActionCard,
  DraftMessage,
} from './index';

/**
 * Canvas Kit Component Test Page
 * 
 * Quick visual verification that Canvas Kit v14 tokens are loading correctly.
 * Add this to your router if components appear unstyled.
 * 
 * What to check:
 * - Select dropdown should have Canvas Kit styling (not native browser default)
 * - Buttons should have proper colors and hover states
 * - Card should have subtle shadow and border radius
 * - Text should use Roboto font
 * - CSS variables (--ck-*) should be present in browser DevTools
 */
export const CanvasKitTest = () => {
  const [selectValue, setSelectValue] = React.useState('option1');
  const [textValue, setTextValue] = React.useState('');
  const [dateValue, setDateValue] = React.useState('');

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Heading size="large" marginBottom="m">
        Canvas Kit Component Test
      </Heading>
      
      <BodyText size="small" marginBottom="l" color="licorice300">
        This page verifies Canvas Kit v14 is working correctly. All components should be styled.
      </BodyText>

      {/* Test 1: Select Component */}
      <Card padding="l" marginBottom="l">
        <Heading size="small" marginBottom="m">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={checkSmallIcon} accent="positive" />
            Test 1: Select Component
          </Flex>
        </Heading>
        
        <FormField>
          <FormField.Label htmlFor="test-select">Test Select</FormField.Label>
          <Select
            id="test-select"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </FormField>
        
        <BodyText size="small" marginTop="s" color="licorice300">
          ✓ Should have Canvas Kit styling, not native browser dropdown
        </BodyText>
      </Card>

      {/* Test 2: Text Input */}
      <Card padding="l" marginBottom="l">
        <Heading size="small" marginBottom="m">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={checkSmallIcon} accent="positive" />
            Test 2: Text Input
          </Flex>
        </Heading>
        
        <FormField>
          <FormField.Label htmlFor="test-input">Test Text Input</FormField.Label>
          <TextInput
            id="test-input"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Type something..."
          />
        </FormField>
        
        <BodyText size="small" marginTop="s" color="licorice300">
          ✓ Should have rounded corners and proper focus state
        </BodyText>
      </Card>

      {/* Test 3: Date Input */}
      <Card padding="l" marginBottom="l">
        <Heading size="small" marginBottom="m">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={checkSmallIcon} accent="positive" />
            Test 3: Date Input
          </Flex>
        </Heading>
        
        <FormField>
          <FormField.Label htmlFor="test-date">Test Date Input</FormField.Label>
          <TextInput
            id="test-date"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </FormField>
        
        <BodyText size="small" marginTop="s" color="licorice300">
          ✓ Should have Canvas Kit styling applied to date picker
        </BodyText>
      </Card>

      {/* Test 4: Buttons */}
      <Card padding="l" marginBottom="l">
        <Heading size="small" marginBottom="m">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={checkSmallIcon} accent="positive" />
            Test 4: Buttons
          </Flex>
        </Heading>
        
        <Flex gap="s" marginBottom="s">
          <PrimaryButton>Primary Button</PrimaryButton>
          <SecondaryButton>Secondary Button</SecondaryButton>
        </Flex>
        
        <BodyText size="small" marginTop="s" color="licorice300">
          ✓ Should have proper colors and hover states
        </BodyText>
      </Card>

      {/* Test 5: SanaComm Patterns (Conversational UI) */}
      <Card padding="l" marginBottom="l">
        <Heading size="small" marginBottom="m">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={checkSmallIcon} accent="positive" />
            Test 5: SanaComm Patterns (Conversational UI)
          </Flex>
        </Heading>
        
        <Box style={{ backgroundColor: SANA_COMM_PANEL_SURFACE, padding: '24px', borderRadius: '12px', border: '1px solid #E8EBEF' }}>
          <Flex flexDirection="column" gap="m">
            {/* Assistant Bubble */}
            <Flex alignItems="flex-start" gap="xs" style={{ width: '100%' }}>
              <Avatar as="div" size="small" altText="Assistant" style={{ flexShrink: 0 }} />
              <Box style={{ flex: 1, minWidth: 0 }}>
                <SanaCommMessageBubble align="start">
                  Hi Layla! I see you're interested in the <strong>Senior Recruiter</strong> role in Dubai.
                  <br /><br />
                  Great! Let's get started. Could you please upload your resume?
                </SanaCommMessageBubble>
              </Box>
            </Flex>

            {/* Candidate Bubble */}
            <Flex justifyContent="flex-end" style={{ width: '100%' }}>
              <SanaCommMessageBubble align="end">
                Yes, that's correct
              </SanaCommMessageBubble>
            </Flex>
          </Flex>

          {/* Composer */}
          <Box marginTop="l">
            <SanaCommComposer
              value=""
              onChange={() => {}}
              placeholder="Type a message..."
              onSend={() => {}}
              sendDisabled={true}
            />
          </Box>
        </Box>
        
        <BodyText size="small" marginTop="s" color="licorice300">
          ✓ Should render conversational bubbles with correct radii and a docked composer
        </BodyText>
      </Card>

      {/* Test 6: Candidate Experience Patterns */}
      <Card padding="l" marginBottom="l">
        <Heading size="small" marginBottom="m">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={checkSmallIcon} accent="positive" />
            Test 6: Candidate Experience Patterns
          </Flex>
        </Heading>
        
        <Flex flexDirection="column" gap="m">
          <CareerSiteHero greeting="Hi Layla, what kind of role are you looking for today?" />
          
          <JobCard 
            title="Senior Recruiter" 
            metadata="Dubai, UAE · Full-time · Hybrid" 
            onViewJob={() => {}} 
          />
          
          <Box style={{ border: '1px solid #E8EBEF', borderRadius: '12px', padding: '24px' }}>
            <JobDetailsStickyFooter />
          </Box>
        </Flex>
        
        <BodyText size="small" marginTop="s" color="licorice300">
          ✓ Should render Candidate Experience components (Hero, Job Card, Sticky Footer)
        </BodyText>
      </Card>

      {/* Test 7: GenUI Patterns */}
      <Card padding="l" marginBottom="l">
        <Heading size="small" marginBottom="m">
          <Flex alignItems="center" gap="xs">
            <SystemIcon icon={checkSmallIcon} accent="positive" />
            Test 7: GenUI Patterns
          </Flex>
        </Heading>
        
        <Flex flexDirection="column" gap="m">
          <CandidateActionCard 
            name="Layla Osman" 
            metadata="Applied 2 hours ago · 89% match · Referral" 
            onReject={() => {}} 
            onAdvance={() => {}} 
          />
          
          <DraftMessage 
            recipient="Alex Chen" 
            message="Hi Alex, Just following up on REQ-2026-001 (Senior Software Engineer). We have a few candidates waiting for your feedback. Could you please review them when you have a moment?" 
            onEdit={() => {}} 
            onSend={() => {}} 
          />
        </Flex>
        
        <BodyText size="small" marginTop="s" color="licorice300">
          ✓ Should render GenUI components (CandidateActionCard, DraftMessage)
        </BodyText>
      </Card>

      {/* Debugging Info */}
      <Card padding="l" backgroundColor="soap100">
        <Heading size="small" marginBottom="s">
          Debugging Tips
        </Heading>
        
        <BodyText as="div" size="small">
          <p style={{ marginBottom: '8px' }}>
            If components appear unstyled:
          </p>
          <ol style={{ marginLeft: '20px', marginBottom: '12px' }}>
            <li>Open browser DevTools and inspect a Select element</li>
            <li>Look for CSS variables like <code style={{ background: 'white', padding: '2px 4px', borderRadius: '3px' }}>--ck-color-bg-default</code></li>
            <li>If variables are missing → check main.tsx for token imports</li>
            <li>If variables present but not applied → component API issue</li>
          </ol>
          
          <p style={{ marginTop: '12px', fontWeight: 500 }}>
            Required imports in main.tsx:
          </p>
          <pre style={{ 
            background: 'white', 
            padding: '12px', 
            borderRadius: '4px', 
            overflow: 'auto',
            fontSize: '12px',
            marginTop: '8px'
          }}>
{`import '@workday/canvas-tokens-web/css/base/_variables.css';
import '@workday/canvas-tokens-web/css/system/_variables.css';
import '@workday/canvas-tokens-web/css/brand/_variables.css';`}
          </pre>
        </BodyText>
      </Card>
    </div>
  );
};
