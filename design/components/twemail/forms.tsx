import React from 'react';
import { FormField } from './FormField';
import { TW } from './palette';

export interface TwFormSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  required?: boolean;
  compact?: boolean;
}

/** Native `<select>` + bespoke FormField (no Canvas Kit). */
export function TwFormSelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  compact = false,
}: TwFormSelectProps) {
  return (
    <FormField>
      <FormField.Label htmlFor={id} style={compact ? { marginBottom: '2px' } : undefined}>
        <span style={{ fontSize: compact ? 11 : 14, fontWeight: 600 }}>{label}</span>
        {required ? (
          <span style={{ color: TW.cinnamon600 }}> *</span>
        ) : null}
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
          padding: compact ? '4px 8px' : '8px 12px',
          fontSize: compact ? '12px' : '14px',
          lineHeight: compact ? '18px' : '20px',
          border: `1px solid ${TW.soap400}`,
          borderRadius: '4px',
          backgroundColor: TW.frenchVanilla100,
          color: TW.blackPepper600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
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
}

export interface TwFormTextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' | 'number';
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
}

export function TwFormTextInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  error,
}: TwFormTextInputProps) {
  return (
    <FormField error={error}>
      <FormField.Label htmlFor={id}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
        {required ? (
          <span style={{ color: TW.cinnamon600 }}> *</span>
        ) : null}
      </FormField.Label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: 14,
          lineHeight: '20px',
          border: `1px solid ${error ? TW.cinnamon600 : TW.soap400}`,
          borderRadius: 4,
          backgroundColor: TW.frenchVanilla100,
          color: TW.blackPepper600,
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          cursor: readOnly ? 'default' : undefined,
          /** Keep error state visible (PM compose refs use full-strength red outline). */
          opacity: disabled && !error ? 0.55 : 1,
        }}
      />
      <FormField.Hint
        aria-hidden={error ? undefined : true}
        style={{
          visibility: error ? 'visible' : 'hidden',
          /** Reserve one line so From/To stay aligned when only one field errors. */
          minHeight: '1.2em',
        }}
      >
        {error ?? '\u00a0'}
      </FormField.Hint>
    </FormField>
  );
}
