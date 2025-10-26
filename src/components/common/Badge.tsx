// src/components/common/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
  rounded = false,
  icon,
  removable = false,
  onRemove,
  className = '',
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const roundedStyle = rounded ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${roundedStyle}
        ${className}
      `}
    >
      {/* Icon */}
      {icon && <span className="flex-shrink-0">{icon}</span>}

      {/* Content */}
      <span>{children}</span>

      {/* Remove button */}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="flex-shrink-0 ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          type="button"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Status Badge variant (with dot indicator)
const StatusBadge: React.FC<{
  status: 'active' | 'inactive' | 'pending' | 'error';
  children?: React.ReactNode;
}> = ({ status, children }) => {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active', dot: '🟢' },
    inactive: { variant: 'gray' as const, label: 'Inactive', dot: '⚫' },
    pending: { variant: 'warning' as const, label: 'Pending', dot: '🟡' },
    error: { variant: 'danger' as const, label: 'Error', dot: '🔴' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} icon={config.dot}>
      {children || config.label}
    </Badge>
  );
};

// Count Badge (for notifications)
const CountBadge: React.FC<{
  count: number;
  max?: number;
  variant?: BadgeProps['variant'];
}> = ({ count, max = 99, variant = 'danger' }) => {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge variant={variant} size="sm" rounded>
      {displayCount}
    </Badge>
  );
};

export default Object.assign(Badge, {
  Status: StatusBadge,
  Count: CountBadge,
});

/* 
USAGE EXAMPLES:

// 1. Simple badge
<Badge>New</Badge>

// 2. Colored badges
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>

// 3. With icon
<Badge variant="success" icon={<span>✓</span>}>
  Verified
</Badge>

// 4. Rounded
<Badge variant="primary" rounded>
  Beta
</Badge>

// 5. Removable (tags)
<Badge 
  variant="info" 
  removable 
  onRemove={() => console.log('Removed!')}
>
  React
</Badge>

// 6. Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// 7. Status badge
<Badge.Status status="active" />
<Badge.Status status="pending">Processing</Badge.Status>
<Badge.Status status="error">Failed</Badge.Status>

// 8. Count badge (notifications)
<Badge.Count count={5} />
<Badge.Count count={150} max={99} />  // Shows "99+"

// 9. Category badges (like in DataTable)
<Badge variant="primary">Electronics</Badge>
<Badge variant="success">Clothing</Badge>
<Badge variant="warning">Food</Badge>

// 10. In a list of tags
<div className="flex flex-wrap gap-2">
  {['React', 'TypeScript', 'Tailwind'].map(tag => (
    <Badge key={tag} variant="gray" removable>
      {tag}
    </Badge>
  ))}
</div>
*/
