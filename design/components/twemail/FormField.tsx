import React from 'react';
import { TW } from './palette';

export function FormField({
  children,
  error,
}: {
  children: React.ReactNode;
  /** Canvas Kit compat: `'error'` means field is in error state (hint text comes from children). */
  error?: string | 'error';
}) {
  const hasErr = Boolean(error);
  return (
    <div style={{ marginBottom: hasErr ? 4 : 0 }} data-field-error={hasErr ? 'true' : undefined}>
      {children}
    </div>
  );
}

FormField.Label = function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} style={{ display: 'block', ...props.style }} />;
};

FormField.Hint = function Hint(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      style={{
        margin: '6px 0 0',
        fontSize: 12,
        fontWeight: 500,
        color: TW.cinnamon600,
        ...props.style,
      }}
    />
  );
};
