import { JSX } from "react";

interface VisuallyHiddenProps {
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
  }
  
  export function VisuallyHidden({ 
    children, 
    as: Component = 'span' 
  }: VisuallyHiddenProps) {
    return (
      <Component
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0'
        }}
      >
        {children}
      </Component>
    );
  }