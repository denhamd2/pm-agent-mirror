/**
 * FilterPill Component
 * 
 * Interactive pill-shaped filter button for dataset filtering.
 * Displays label with optional count badge and active/inactive states.
 * 
 * @example
 * ```tsx
 * <FilterPill
 *   id="open"
 *   label="Open"
 *   count={32}
 *   active={true}
 *   onClick={(id) => handleFilterChange(id)}
 * />
 * ```
 */

import React from 'react';
import { colors } from '@workday/canvas-kit-react/tokens';
import { SANA_LINK_ACCENT } from './sanaShellTheme';

export interface FilterPillProps {
  /** Unique identifier for the filter */
  id: string;
  /** Display label (can include count in format like "All (38)") */
  label: string;
  /** Optional count to append to label */
  count?: number;
  /** Whether this filter is currently active */
  active?: boolean;
  /** Click handler receiving the filter id */
  onClick?: (id: string) => void;
}

/**
 * FilterPill - Interactive filter control
 * 
 * Pill-shaped button for filtering datasets with:
 * - Active/inactive visual states
 * - Optional count badge
 * - Outlined style (not filled)
 * 
 * Distinct from StatusIndicator (read-only) and Tab components (navigation).
 * Follows Sana Style with blue accent for active state.
 */
export const FilterPill: React.FC<FilterPillProps> = ({
  id,
  label,
  count,
  active = false,
  onClick,
}) => {
  const displayLabel = count !== undefined ? `${label} (${count})` : label;

  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      aria-pressed={active}
      style={{
        borderRadius: 999,
        border: `1px solid ${active ? SANA_LINK_ACCENT : colors.soap300}`,
        backgroundColor: active ? colors.soap100 : colors.frenchVanilla100,
        padding: '6px 14px',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: colors.blackPepper600,
        transition: 'all 0.15s ease',
      }}
    >
      {displayLabel}
    </button>
  );
};
