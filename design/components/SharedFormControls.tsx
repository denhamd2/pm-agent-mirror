import React from 'react';
import { FormField } from '@workday/canvas-kit-react/form-field';
import { TextInput } from '@workday/canvas-kit-react/text-input';

/**
 * Shared Form Controls - Reusable Canvas Kit form components
 * 
 * These components ensure consistent styling and proper Canvas Kit v14 usage
 * across all prototypes. Always prefer these over ad-hoc FormField compositions.
 * 
 * Note: FormSelect uses native HTML <select> instead of Canvas Kit Select component
 * because Canvas Kit v14 Select is a compound component (Select.Input, Select.List, etc.)
 * which is more complex than needed for simple filter dropdowns.
 */

// ============================================================================
// FormSelect - Reusable Select Dropdown
// ============================================================================

export interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Canvas Kit Select with proper FormField composition
 * 
 * Usage:
 * ```tsx
 * <FormSelect
 *   id="location-filter"
 *   label="Location"
 *   value={location}
 *   onChange={setLocation}
 *   options={[
 *     { value: 'all', label: 'All' },
 *     { value: 'dubai', label: 'Dubai, UAE' }
 *   ]}
 * />
 * ```
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
}) => {
  return (
  <FormField>
    <FormField.Label htmlFor={id}>
      {label}
      {required && <span style={{ color: 'var(--ck-color-fg-critical)' }}> *</span>}
    </FormField.Label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-required={required}
      aria-disabled={disabled}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        lineHeight: '20px',
        border: `1px solid #C5C5C5`,
        borderRadius: '4px',
        backgroundColor: '#FFFFFF',
        color: '#333333',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </FormField>
);
};

// ============================================================================
// FormTextInput - Reusable Text Input
// ============================================================================

export interface FormTextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'number';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

/**
 * Canvas Kit TextInput with proper FormField composition
 * 
 * Usage:
 * ```tsx
 * <FormTextInput
 *   id="email"
 *   label="Email address"
 *   value={email}
 *   onChange={setEmail}
 *   type="email"
 *   placeholder="you@example.com"
 *   required
 * />
 * ```
 */
export const FormTextInput: React.FC<FormTextInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  error,
}) => (
  <FormField error={error ? 'error' : undefined}>
    <FormField.Label htmlFor={id}>
      {label}
      {required && <span style={{ color: 'var(--ck-color-fg-critical)' }}> *</span>}
    </FormField.Label>
    <TextInput
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      aria-required={required}
    />
    {error && (
      <FormField.Hint>
        {error}
      </FormField.Hint>
    )}
  </FormField>
);

// ============================================================================
// FormDateInput - Specialized Date Input
// ============================================================================

export interface FormDateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
}

/**
 * Canvas Kit TextInput configured for date input
 * 
 * Usage:
 * ```tsx
 * <FormDateInput
 *   id="applied-from"
 *   label="Applied from"
 *   value={dateStart}
 *   onChange={setDateStart}
 * />
 * ```
 */
export const FormDateInput: React.FC<FormDateInputProps> = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  min,
  max,
}) => (
  <FormField>
    <FormField.Label htmlFor={id}>
      {label}
      {required && <span style={{ color: 'var(--ck-color-fg-critical)' }}> *</span>}
    </FormField.Label>
    <TextInput
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="date"
      disabled={disabled}
      aria-required={required}
      min={min}
      max={max}
    />
  </FormField>
);
