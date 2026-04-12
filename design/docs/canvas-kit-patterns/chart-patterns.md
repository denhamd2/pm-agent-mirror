# Chart Patterns

Canvas Kit patterns for data visualization using `ChartCard` and `react-chartjs-2`.

## Color Schemes

Workday does not use a separate, disconnected palette for charts. Instead, charts leverage the standard Canvas Kit semantic and brand tokens (`@workday/canvas-kit-react/tokens`).

These standard sequences are exported as `CHART_COLORS` from `design/components/GenUIPatterns.tsx`.

### 1. Single-Metric / Primary Data
Use `CHART_COLORS.primary` (`colors.blueberry500`).

### 2. Categorical / Multi-Series Data
Use a consistent sequence of the core palette to ensure contrast and brand alignment. The established sequence is available as `CHART_COLORS.categorical`:
1. `colors.blueberry500` (Blue)
2. `colors.greenApple400` (Green)
3. `colors.cantaloupe400` (Orange/Yellow)
4. `colors.cinnamon400` (Red)
5. `colors.soap400` (Grey/Neutral)

### 3. Semantic / Status Data
When segments represent health or urgency, use the semantic colors available in `CHART_COLORS.semantic`:
- **Positive/Healthy**: `colors.greenApple500`
- **Negative/Urgent**: `colors.cinnamon500`
- **Warning**: `colors.cantaloupe500`
- **Standard/Neutral**: `colors.blueberry400`

## ChartCard Component

The `ChartCard` component (from `design/components/GenUIPatterns.tsx`) is a smart wrapper that automatically injects the correct Canvas Kit styling if it is not explicitly overridden.

### Automatic Styling Injection
- **Doughnut/Pie Charts**: Automatically sets `borderWidth: 0` on datasets to remove default white borders.
- **Bar/Line Charts**: Automatically hides grid lines on the X and Y axes to reduce visual clutter.
- **Color Fallbacks**: If a dataset is passed without a `backgroundColor`, `ChartCard` will automatically apply the `CHART_COLORS.categorical` sequence (or `CHART_COLORS.primary` for single-series data).

### Usage

```tsx
import { ChartCard, CHART_COLORS } from './components';

// Example: Single-Metric Bar Chart (Colors automatically injected)
<ChartCard 
  title="Active Pipeline Funnel" 
  type="bar"
  data={{
    labels: ['Applied', 'Screened', 'Interview', 'Offer'],
    datasets: [{
      label: 'Candidates',
      data: [145, 42, 8, 3],
      // backgroundColor: CHART_COLORS.primary is automatically applied
      borderRadius: 4,
    }]
  }}
/>

// Example: Semantic Doughnut Chart (Explicitly setting semantic colors)
<ChartCard
  title="Reqs Need Attention"
  type="doughnut"
  data={{
    labels: ['High Priority', 'Standard'],
    datasets: [{
      data: [2, 1],
      backgroundColor: [
        CHART_COLORS.semantic.negative, // cinnamon500
        CHART_COLORS.semantic.neutral,  // blueberry400
      ],
      // borderWidth: 0 is automatically applied
    }]
  }}
  options={{
    cutout: '70%',
  }}
/>
```

## Best Practices

- **Containers**: Charts should always be wrapped in the `ChartCard` component, which enforces the Sana Style guidelines (neutral `frenchVanilla100` background, `SANA_CARD_RADIUS_LG` border radius, and `soap300` borders).
- **Legends**: Keep legends minimal. `ChartCard` defaults to `position: 'bottom'`. For small or embedded charts, you may want to override this to `position: 'right'` or disable it entirely (`display: false`).
- **Conversational Interfaces**: When embedding `ChartCard` inside a chat interface (e.g., using `SanaCommMessageBubble`), ensure the bubble is allowed to expand to the full width of the container (`maxWidth="100%"`) so that the chart has enough room.
