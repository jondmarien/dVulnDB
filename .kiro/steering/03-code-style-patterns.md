# DVulnDB Code Style & Patterns

## TypeScript Guidelines
- **Strict Mode**: Always use strict TypeScript configuration
- **Interface over Type**: Prefer interfaces for object shapes, types for unions/primitives
- **Explicit Return Types**: Always specify return types for functions and components
- **Null Safety**: Use optional chaining and nullish coalescing operators

## React Component Patterns
- **Functional Components**: Use function declarations, not arrow functions for components
- **Props Interface**: Always define props interface above component
- **Default Export**: Use default exports for components, named exports for utilities
- **Component Structure**:
  ```typescript
  interface ComponentProps {
    prop: string;
    optional?: boolean;
  }

  const Component: React.FC<ComponentProps> = ({ prop, optional = false }) => {
    // hooks first
    // event handlers
    // render logic
    return <div>{prop}</div>;
  };

  export default Component;
  ```

## File Organization
- **Path Aliases**: Use configured aliases (@/, @components/, @context/, etc.)
- **Component Structure**: 
  - `src/components/[feature]/ComponentName.tsx`
  - `src/app/[route]/page.tsx` for pages
  - `src/context/` for React contexts
- **Naming Conventions**:
  - Components: PascalCase
  - Files: PascalCase for components, kebab-case for utilities
  - Variables: camelCase
  - Constants: SCREAMING_SNAKE_CASE

## Web3 Integration Patterns
- **Hook-based**: Create custom hooks for Web3 interactions
- **Error Handling**: Always handle wallet connection errors gracefully
- **Loading States**: Provide loading indicators for blockchain operations
- **Mock Mode**: Support mock mode for development and testing
- **Network Detection**: Handle different networks (mainnet, devnet, testnet)

## CSS and Styling
- **Tailwind First**: Use Tailwind classes for styling
- **CSS Variables**: Use CSS custom properties for theme values
- **Component Modules**: Use CSS modules for component-specific styles when needed
- **Responsive Design**: Mobile-first approach with responsive utilities

## Error Handling
- **Try-Catch**: Wrap async operations in try-catch blocks
- **User Feedback**: Provide meaningful error messages to users
- **Console Logging**: Use structured logging for debugging
- **Fallback UI**: Provide fallback components for error states

## Performance Considerations
- **React.memo**: Memoize expensive components
- **useCallback/useMemo**: Optimize re-renders and expensive calculations
- **Code Splitting**: Use dynamic imports for large components
- **Image Optimization**: Use Next.js Image component for optimized images