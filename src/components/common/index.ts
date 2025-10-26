// src/components/common/index.ts
// Centralized export file for all common components

export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Badge } from './Badge';
export { default as Loading } from './Loading';
export { default as Input } from './Input';
export { default as Modal } from './Modal';

// Export types if needed
export type { default as ButtonProps } from './Button';
export type { default as CardProps } from './Card';
export type { default as BadgeProps } from './Badge';
export type { default as LoadingProps } from './Loading';
export type { default as InputProps } from './Input';
export type { default as ModalProps } from './Modal';

/* 
USAGE:

// Import all at once
import { Button, Card, Badge, Loading, Input, Modal } from '@/components/common';

// Or import individually
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

// Using components
function MyPage() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Title</Card.Title>
      </Card.Header>
      
      <Card.Content>
        <Input label="Name" />
        <Button>Submit</Button>
      </Card.Content>
    </Card>
  );
}
*/
