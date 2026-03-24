import React, { useState } from 'react';
import { 
  Heading, 
  BodyText, 
  FormField,
  TextInput,
  Table,
  StatusIndicator
} from '@workday/canvas-kit-react';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { Select } from '@workday/canvas-kit-react/select';

// GCC Nationalization OOB Fields Prototype
// Mission: GCC-E2E-016
// PRD: docs/prds/gcc-nationalization-oob-fields-prd.md

const GccNationalizationOobV56 = () => {
  const [view, setView] = useState<'config' | 'dashboard' | 'apply'>('config');
  const [quotas, setQuotas] = useState({
    'Saudi Arabia': 60,
    'UAE': 20,
    'Kuwait': 50,
    'Bahrain': 10,
    'Oman': 10,
    'Qatar': 10
  });

  // Screen A: Tenant Configuration
  const ConfigScreen = () => (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Heading size="large">GCC Nationalization Configuration</Heading>
      <BodyText size="medium" style={{ marginTop: '8px', marginBottom: '24px' }}>
        Configure nationalization quota targets for GCC countries.
      </BodyText>
      
      {Object.keys(quotas).map((country) => (
        <FormField key={country}>
          <FormField.Label>{country}</FormField.Label>
          <FormField.Input
            as={TextInput}
            type="number" 
            value={quotas[country as keyof typeof quotas]} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setQuotas({...quotas, [country]: parseInt(e.target.value) || 0})
            }
          />
          <FormField.Hint>
            Enter target percentage (0-100). Example: 60 for Saudization, 20 for Emiratization
          </FormField.Hint>
        </FormField>
      ))}
      
      <PrimaryButton style={{ marginTop: '24px' }}>
        Save configuration
      </PrimaryButton>
    </div>
  );

  // Screen B: Recruiter Dashboard
  const DashboardScreen = () => {
    const mockData = [
      { country: 'Saudi Arabia', hired: 45, target: 60, status: 'at-risk' },
      { country: 'UAE', hired: 22, target: 20, status: 'on-track' },
      { country: 'Kuwait', hired: 30, target: 50, status: 'at-risk' }
    ];

    return (
      <div style={{ padding: '24px' }}>
        <Heading size="large">Nationalization Compliance</Heading>
        <Table style={{ marginTop: '24px', width: '100%' }}>
          <Table.Head>
            <Table.Row>
              <Table.Header>Country</Table.Header>
              <Table.Header>Hired (%)</Table.Header>
              <Table.Header>Target (%)</Table.Header>
              <Table.Header>Status</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {mockData.map((row, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{row.country}</Table.Cell>
                <Table.Cell>{row.hired}%</Table.Cell>
                <Table.Cell>{row.target}%</Table.Cell>
                <Table.Cell>
                  <StatusIndicator 
                    type={row.status === 'on-track' ? StatusIndicator.Type.Green : StatusIndicator.Type.Orange}
                    emphasis={row.status === 'on-track' ? StatusIndicator.Emphasis.Low : StatusIndicator.Emphasis.High}
                    label={row.status === 'on-track' ? 'On track' : 'At risk'}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  };

  // Screen C: Candidate Apply Question
  const ApplyScreen = () => (
    <div style={{ padding: '24px', maxWidth: '500px', margin: '0 auto' }}>
      <Heading size="large">Application</Heading>
      
      <FormField style={{ marginTop: '24px' }}>
        <FormField.Label>Nationality (Optional)</FormField.Label>
        <FormField.Input
          as={Select}
        >
          <option value="">Select...</option>
          <option value="SA">Saudi Arabian</option>
          <option value="AE">Emirati</option>
          <option value="KW">Kuwaiti</option>
          <option value="BH">Bahraini</option>
          <option value="OM">Omani</option>
          <option value="QA">Qatari</option>
          <option value="other">Other</option>
          <option value="prefer-not">Prefer not to say</option>
        </FormField.Input>
        <FormField.Hint style={{ fontStyle: 'italic' }}>
          This information is collected for nationalization quota compliance purposes only.
        </FormField.Hint>
      </FormField>
    </div>
  );

  // View Switcher (for prototype navigation)
  return (
    <div>
      {/* Prototype Nav */}
      <div style={{ 
        padding: '12px 24px', 
        background: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '16px'
      }}>
        <SecondaryButton 
          size="small" 
          onClick={() => setView('config')}
          style={{ fontWeight: view === 'config' ? 'bold' : 'normal' }}
        >
          Config
        </SecondaryButton>
        <SecondaryButton 
          size="small" 
          onClick={() => setView('dashboard')}
          style={{ fontWeight: view === 'dashboard' ? 'bold' : 'normal' }}
        >
          Dashboard
        </SecondaryButton>
        <SecondaryButton 
          size="small" 
          onClick={() => setView('apply')}
          style={{ fontWeight: view === 'apply' ? 'bold' : 'normal' }}
        >
          Candidate Apply
        </SecondaryButton>
        <BodyText size="small" style={{ marginLeft: 'auto', alignSelf: 'center', color: '#666' }}>
          GCC-E2E-016 | v56 Prototype
        </BodyText>
      </div>

      {/* Content */}
      {view === 'config' && <ConfigScreen />}
      {view === 'dashboard' && <DashboardScreen />}
      {view === 'apply' && <ApplyScreen />}
    </div>
  );
};

export default GccNationalizationOobV56;
