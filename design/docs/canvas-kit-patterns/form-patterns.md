# Form Patterns

Canvas Kit form patterns for filters, inputs, and form controls in Workday Recruiting prototypes.

## Shared Form Components (PREFERRED)

**Location**: `design/components/SharedFormControls.tsx`

**ALWAYS check shared components BEFORE building forms.** These provide consistent styling and behavior across all prototypes.

### FormSelect (Dropdown Filters)

**Use for**: 90% of dropdown/filter use cases in prototypes.

**Features**:
- Native HTML `<select>` with FormField wrapper
- Proper Canvas Kit styling
- Label positioning
- Error state support
- Simple API

**Import**:
```tsx
import { FormSelect } from './components';
```

**Usage**:
```tsx
<FormSelect
  id="location-filter"
  label="Location"
  value={location}
  onChange={setLocation}
  options={[
    { value: 'all', label: 'All' },
    { value: 'dubai', label: 'Dubai, UAE' },
    { value: 'riyadh', label: 'Riyadh, KSA' }
  ]}
/>
```

**Common filters**:
- Stage: `['all', 'screening', 'interview', 'offer']`
- Source: `['all', 'referral', 'linkedin', 'job-board']`
- Location: `['all', 'dubai', 'riyadh', 'doha']`
- Status: `['all', 'active', 'inactive', 'rejected']`

### FormTextInput

**Use for**: Text inputs with labels and validation.

**Import**:
```tsx
import { FormTextInput } from './components';
```

**Usage**:
```tsx
<FormTextInput
  id="search-input"
  label="Search candidates"
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Name or email..."
  error={errorMessage}
/>
```

### FormDateInput

**Use for**: Date selectors with calendar picker.

**Import**:
```tsx
import { FormDateInput } from './components';
```

**Usage**:
```tsx
<FormDateInput
  id="start-date"
  label="Start date"
  value={startDate}
  onChange={setStartDate}
/>
```

## Canvas Kit Select (Advanced Use Only)

**When to use**: Complex autocomplete, typeahead, multi-select (rare in prototypes).

**When NOT to use**: Simple dropdowns (use `FormSelect` instead).

Canvas Kit v14 `Select` is a compound component for advanced scenarios:

```tsx
import { FormField } from '@workday/canvas-kit-react/form-field';
import { Select } from '@workday/canvas-kit-react/select';

<FormField>
  <FormField.Label htmlFor="select-id">Label</FormField.Label>
  <Select id="select-id" value={val} onChange={handler}>
    <option value="">Choose...</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </Select>
</FormField>
```

**Note**: `FormField.Input as={Select}` may have styling issues in some Canvas Kit versions. Prefer direct `Select` for reliability.

## TextInput Component

Canvas Kit `TextInput` for direct use (when not using shared `FormTextInput`).

**Import**:
```tsx
import { TextInput } from '@workday/canvas-kit-react/text-input';
```

**Basic usage**:
```tsx
<TextInput
  placeholder="Search..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  style={{ width: '100%', backgroundColor: colors.soap100 }}
/>
```

**Key details**:
- Style props go **directly** on component (NOT via `inputProps`)
- Use `style={{}}` for custom styling
- Width, background, padding via style object

## Search Pattern

For global search or scoped search fields:

```tsx
import { InputGroup } from '@workday/canvas-kit-react/text-input';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { searchIcon } from '@workday/canvas-system-icons-web';

<InputGroup>
  <InputGroup.InnerStart paddingLeft="s">
    <SystemIcon icon={searchIcon} size={20} />
  </InputGroup.InnerStart>
  <InputGroup.Input
    placeholder="Search candidates..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</InputGroup>
```

**For top nav pill search**: Use `WorkdayTopNav` component which includes search built-in.

## FormField Composition Pattern (v14)

Canvas Kit v14 uses **composition** for form fields:

**Current pattern** (v14):
```tsx
import { FormField } from '@workday/canvas-kit-react/form-field';
import { TextInput } from '@workday/canvas-kit-react/text-input';

<FormField>
  <FormField.Label htmlFor="email-id">Email address</FormField.Label>
  <FormField.Input as={TextInput} id="email-id" />
  <FormField.Hint>Enter your work email</FormField.Hint>
</FormField>
```

**Legacy pattern** (pre-v14, avoid):
```tsx
// ❌ OLD - Don't use `label` and `inputId` props
<FormField label="Email address" inputId="email-id">
  <TextInput id="email-id" />
</FormField>
```

## Filter Bar Pattern

Standard pattern for list views with filters:

```tsx
import { FormSelect } from './components';

<Flex gap="m" marginBottom="l" alignItems="flex-end">
  <FormSelect
    id="stage-filter"
    label="Stage"
    value={stage}
    onChange={setStage}
    options={[
      { value: 'all', label: 'All' },
      { value: 'screening', label: 'Screening' },
      { value: 'interview', label: 'Interview' },
      { value: 'offer', label: 'Offer' }
    ]}
  />
  <FormSelect
    id="source-filter"
    label="Source"
    value={source}
    onChange={setSource}
    options={[
      { value: 'all', label: 'All' },
      { value: 'referral', label: 'Referral' },
      { value: 'linkedin', label: 'LinkedIn' }
    ]}
  />
  <FormTextInput
    id="search-input"
    label="Search"
    value={search}
    onChange={setSearch}
    placeholder="Name or email..."
  />
</Flex>
```

## Form Validation Pattern

Show validation errors inline:

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

<FormTextInput
  id="email-input"
  label="Email address"
  value={email}
  onChange={setEmail}
  placeholder="you@example.com"
  error={errors.email}
  required
/>

{errors.email && (
  <BodyText size="small" color={colors.cinnamon600} marginTop="xxs">
    {errors.email}
  </BodyText>
)}
```

## Radio and Checkbox Groups

For channel selectors, preference toggles:

```tsx
import { Radio, RadioGroup } from '@workday/canvas-kit-react/radio';

<RadioGroup name="channel" value={channel} onChange={setChannel}>
  <Radio label="Email" value="email" />
  <Radio label="SMS" value="sms" />
  <Radio label="WhatsApp" value="whatsapp" />
</RadioGroup>
```

```tsx
import { Checkbox } from '@workday/canvas-kit-react/checkbox';

<Checkbox
  label="WhatsApp consent only"
  checked={consentFilter}
  onChange={(e) => setConsentFilter(e.target.checked)}
/>
```

## Accessibility in Forms

### Required Fields

```tsx
<FormField>
  <FormField.Label htmlFor="email-id">
    Email address <span style={{ color: colors.cinnamon600 }}>*</span>
  </FormField.Label>
  <FormField.Input 
    as={TextInput} 
    id="email-id" 
    required
    aria-required="true"
  />
</FormField>
```

### Help Text and Descriptions

```tsx
<FormField>
  <FormField.Label htmlFor="phone-id">Phone number</FormField.Label>
  <FormField.Input as={TextInput} id="phone-id" aria-describedby="phone-help" />
  <FormField.Hint id="phone-help">
    Include country code (e.g., +971 for UAE)
  </FormField.Hint>
</FormField>
```

### Error States

```tsx
<FormField error="error">
  <FormField.Label htmlFor="email-id">Email address</FormField.Label>
  <FormField.Input 
    as={TextInput} 
    id="email-id" 
    aria-invalid="true"
  />
  <FormField.Hint>Please enter a valid email address</FormField.Hint>
</FormField>
```

## Best Practices

### DO
- ✅ Use `FormSelect` from `SharedFormControls.tsx` for 90% of dropdowns
- ✅ Use `FormField` composition pattern (v14)
- ✅ Add proper labels with `htmlFor` / `id` matching
- ✅ Use `aria-required`, `aria-describedby`, `aria-invalid` for accessibility
- ✅ Show inline validation errors
- ✅ Use consistent filter patterns (Stage, Source, Location, Status)
- ✅ Mark required fields with asterisk

### DON'T
- ❌ Use Canvas Kit `Select` compound component for simple dropdowns (overkill)
- ❌ Use legacy FormField `label` / `inputId` props (deprecated in v14)
- ❌ Build custom select dropdowns (use shared FormSelect)
- ❌ Forget accessibility attributes (aria-label, aria-required, aria-describedby)
- ❌ Skip error state handling
- ❌ Use generic form layouts (follow Workday filter bar pattern)
