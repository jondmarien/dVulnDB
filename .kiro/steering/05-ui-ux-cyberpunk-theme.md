# DVulnDB UI/UX & Cyberpunk Theme Guidelines

## Color Palette
- **Primary Green**: `#00ff00` - Main accent color for interactive elements
- **Matrix Green**: `#00ff41` - Text and glow effects
- **Terminal Green**: `#0dbc79` - Secondary accent
- **Neon Green**: `#33cc33` - Highlights and animations
- **Dark Background**: `#0f0f0f` - Primary background
- **Dark Gray**: `#1a1a1a` - Secondary background
- **Border Gray**: `#333` - Borders and dividers
- **Warning Red**: `#ff3333` - Error states and critical alerts
- **Status Blue**: `#00b4d8` - Information and status indicators

## Typography
- **Primary Font**: JetBrains Mono (monospace for terminal aesthetic)
- **Fallback**: 'Courier New', monospace
- **Font Weights**: Regular (400), Medium (500), Semibold (600)
- **Text Shadows**: Use glowing effects with `text-shadow: 0 0 10px #00ff00`
- **Letter Spacing**: Slightly increased for readability in monospace

## Visual Effects
- **Glow Effects**: Apply subtle glow to interactive elements
- **Scan Lines**: Animated scan lines for terminal authenticity
- **Matrix Rain**: Background animation with falling characters
- **Pulse Animations**: For status indicators and loading states
- **Typewriter Effect**: For dynamic text reveals
- **Grid Overlay**: Subtle cyber grid pattern on backgrounds

## Component Styling Patterns
- **Buttons**: 
  - Gradient backgrounds with glow effects
  - Uppercase text with letter spacing
  - Hover states with increased glow and slight transform
- **Cards**: 
  - Dark backgrounds with subtle borders
  - Animated scan line on top edge
  - Gradient overlays for depth
- **Forms**: 
  - Terminal-style inputs with green borders
  - Monospace font for all form elements
  - Focus states with green glow
- **Navigation**: 
  - Terminal prompt indicators (`>`) for active states
  - Hover effects with background glow
  - ASCII art elements in logo

## Animation Guidelines
- **Subtle Movements**: Avoid overwhelming animations
- **Performance**: Use CSS transforms and opacity for smooth animations
- **Accessibility**: Respect `prefers-reduced-motion` settings
- **Loading States**: Terminal-style loading indicators with dots or bars
- **Transitions**: Use easing functions that feel natural but snappy

## Responsive Design
- **Mobile First**: Design for mobile, enhance for desktop
- **Hamburger Menu**: Terminal-style hamburger with animated lines
- **Touch Targets**: Ensure adequate touch target sizes (44px minimum)
- **Readability**: Maintain contrast ratios for accessibility
- **Breakpoints**: Use standard Tailwind breakpoints

## Accessibility Standards
- **Color Contrast**: Ensure WCAG AA compliance with high contrast
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Indicators**: Clear focus states with green outlines
- **Alternative Text**: Descriptive alt text for all images and icons

## Terminal Aesthetic Elements
- **Command Prompts**: Use `>` and `$` symbols for navigation cues
- **ASCII Art**: Incorporate ASCII elements in logos and decorations
- **Monospace Layouts**: Align elements to monospace grid where appropriate
- **Terminal Windows**: Style modals and overlays as terminal windows
- **Status Indicators**: Use terminal-style status messages and codes

## Interactive Feedback
- **Hover States**: Subtle glow and color changes
- **Click Feedback**: Brief flash or pulse on interaction
- **Loading States**: Terminal-style progress indicators
- **Success/Error**: Clear visual feedback with appropriate colors
- **Tooltips**: Terminal-style tooltips with monospace text