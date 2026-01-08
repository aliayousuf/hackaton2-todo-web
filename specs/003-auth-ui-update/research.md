# Research: Authentication UI Split-Screen Layout

## Overview
This research document addresses the implementation of a two-column split-screen authentication UI with a deep navy blue left panel and clean white right panel containing login form elements.

## Design Decisions

### Decision: Use Flexbox for Split-Screen Layout
**Rationale**: Flexbox is ideal for this type of layout as it provides easy control over distribution of space between columns. Using `flex-row` with `lg:flex` will allow the left panel to be hidden on smaller screens with `hidden lg:flex`.

**Alternatives considered**:
- CSS Grid: More complex for this simple two-column layout
- Float-based layout: Outdated approach, not responsive-friendly

### Decision: Tailwind CSS Classes for Styling
**Rationale**: The project constitution mandates Tailwind CSS for all styling. We'll use specific classes to achieve the requested design:
- Left panel: `bg-navy` (deep navy blue), `hidden lg:flex` for mobile responsiveness
- Right panel: `bg-white`, `flex items-center justify-center` for centering content
- Text: Appropriate font weights and sizes for "Hello! Have a GOOD DAY"
- Forms: Light borders with rounded corners as specified

**Alternatives considered**:
- Custom CSS: Violates project constitution requiring Tailwind
- Inline styles: Not maintainable and violates project standards

### Decision: Responsive Breakpoint Strategy
**Rationale**: Using Tailwind's `lg:` breakpoint (1024px) to hide the left panel on smaller screens ensures the login form remains accessible on mobile devices. This aligns with the requirement to hide the left panel on small mobile screens.

**Alternatives considered**:
- Different breakpoints (md: 768px): May still hide content on tablet devices
- Multiple breakpoints: Adds unnecessary complexity

### Decision: Geometric Shapes Implementation
**Rationale**: Using Tailwind CSS with SVG elements for decorative geometric shapes (circles/arcs) to create the requested visual effect. These can be positioned absolutely within the left panel for a modern design aesthetic.

**Alternatives considered**:
- Background images: Less flexible and increases bundle size
- CSS-only shapes: Limited flexibility for complex geometric patterns

## Technical Implementation Approach

### Component Structure
1. **SplitScreenAuth Component**: Main component managing the two-column layout
2. **LeftPanel Component**: Contains welcome text and geometric shapes
3. **RightPanel Component**: Contains the login form and associated UI elements
4. **LoginForm Component**: Updated to match new styling requirements

### Responsive Behavior
- Desktop (≥1024px): Both panels visible in split-screen layout
- Mobile (<1024px): Only right panel with login form visible
- Uses Tailwind's responsive prefixes for clean implementation

### Integration with Existing Auth Logic
- Preserves all existing authentication functionality
- Maintains integration with Better Auth and backend services
- Keeps existing form validation and error handling logic

## Accessibility Considerations
- Proper semantic HTML structure
- Adequate color contrast ratios
- Keyboard navigation support
- Screen reader compatibility

## Performance Impact
- Minimal CSS changes for layout
- SVG geometric shapes optimized for performance
- No additional network requests required
- Expected performance impact: Negligible to slight improvement due to simpler DOM structure