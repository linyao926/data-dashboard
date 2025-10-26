// src/components/common/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-sm',
    bordered: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-md',
    flat: 'bg-gray-50',
  };

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Interactive styles
  const interactiveStyles =
    hoverable || clickable
      ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
      : '';

  const cursorStyle = clickable || onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`
        rounded-lg
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${interactiveStyles}
        ${cursorStyle}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Sub-components for better composition
const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mb-4 ${className}`}>{children}</div>;

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>;

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>;

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={className}>{children}</div>;

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>{children}</div>;

// Export compound component
export default Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

/* 
USAGE EXAMPLES:

// 1. Simple card
<Card>
  <p>Card content</p>
</Card>

// 2. Card with padding
<Card padding="lg">
  <p>Large padding</p>
</Card>

// 3. Elevated hoverable card
<Card variant="elevated" hoverable>
  <p>Hover me!</p>
</Card>

// 4. Clickable card
<Card clickable onClick={() => console.log('Card clicked!')}>
  <p>Click me</p>
</Card>

// 5. Compound card (RECOMMENDED)
<Card variant="default" padding="md">
  <Card.Header>
    <Card.Title>Dashboard Stats</Card.Title>
    <Card.Description>Last updated 5 minutes ago</Card.Description>
  </Card.Header>
  
  <Card.Content>
    <p>Your content here</p>
  </Card.Content>
  
  <Card.Footer>
    <Button variant="outline" size="sm">View Details</Button>
  </Card.Footer>
</Card>

// 6. No padding (for custom layouts)
<Card padding="none">
  <img src="banner.jpg" className="w-full rounded-t-lg" />
  <div className="p-6">
    <h3>Custom layout</h3>
  </div>
</Card>

// 7. Bordered card
<Card variant="bordered" padding="sm">
  <p>Bordered style</p>
</Card>
*/
