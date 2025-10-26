// src/components/common/Loading.tsx
import React from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  className = '',
}) => {
  // Size styles
  const sizeMap = {
    sm: { spinner: 'w-4 h-4', dots: 'w-2 h-2', text: 'text-sm' },
    md: { spinner: 'w-8 h-8', dots: 'w-3 h-3', text: 'text-base' },
    lg: { spinner: 'w-12 h-12', dots: 'w-4 h-4', text: 'text-lg' },
    xl: { spinner: 'w-16 h-16', dots: 'w-5 h-5', text: 'text-xl' },
  };

  // Color styles
  const colorMap = {
    primary: 'border-blue-600 text-blue-600',
    secondary: 'border-gray-600 text-gray-600',
    white: 'border-white text-white',
  };

  // Spinner variant
  const SpinnerVariant = () => (
    <div
      className={`
        animate-spin rounded-full border-4 border-t-transparent
        ${sizeMap[size].spinner}
        ${colorMap[color]}
      `}
    />
  );

  // Dots variant
  const DotsVariant = () => (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            rounded-full animate-bounce bg-current
            ${sizeMap[size].dots}
            ${colorMap[color]}
          `}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );

  // Pulse variant
  const PulseVariant = () => (
    <div
      className={`
        rounded-full animate-pulse bg-current
        ${sizeMap[size].spinner}
        ${colorMap[color]}
      `}
    />
  );

  // Bars variant
  const BarsVariant = () => (
    <div className="flex gap-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`
            w-1 bg-current animate-pulse
            ${colorMap[color]}
          `}
          style={{
            height: `${[16, 24, 20, 28][i]}px`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );

  // Render variant
  const renderVariant = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerVariant />;
      case 'dots':
        return <DotsVariant />;
      case 'pulse':
        return <PulseVariant />;
      case 'bars':
        return <BarsVariant />;
      default:
        return <SpinnerVariant />;
    }
  };

  // Wrapper
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {renderVariant()}
      {text && <p className={`font-medium text-gray-600 ${sizeMap[size].text}`}>{text}</p>}
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton variant for loading placeholders
const Skeleton: React.FC<{
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}> = ({ variant = 'text', width, height, className = '' }) => {
  const baseStyles = 'animate-pulse bg-gray-200';

  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} style={style} />;
};

// Loading overlay for sections
const LoadingOverlay: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  blur?: boolean;
}> = ({ loading, children, blur = true }) => {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            bg-white/80 z-10 rounded-lg
            ${blur ? 'backdrop-blur-sm' : ''}
          `}
        >
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Object.assign(Loading, {
  Skeleton,
  Overlay: LoadingOverlay,
});

/* 
USAGE EXAMPLES:

// 1. Simple spinner
<Loading />

// 2. Different variants
<Loading variant="spinner" />
<Loading variant="dots" />
<Loading variant="pulse" />
<Loading variant="bars" />

// 3. Different sizes
<Loading size="sm" />
<Loading size="md" />
<Loading size="lg" />
<Loading size="xl" />

// 4. With text
<Loading text="Loading data..." />
<Loading variant="dots" text="Please wait" />

// 5. Different colors
<Loading color="primary" />
<Loading color="secondary" />
<Loading color="white" />  // For dark backgrounds

// 6. Full screen overlay
<Loading fullScreen text="Loading application..." />

// 7. Skeleton loaders
<Loading.Skeleton />
<Loading.Skeleton width={200} height={20} />
<Loading.Skeleton variant="circular" width={50} height={50} />
<Loading.Skeleton variant="rectangular" width="100%" height={200} />

// 8. Skeleton for cards
<Card>
  <Loading.Skeleton width="60%" className="mb-2" />
  <Loading.Skeleton width="100%" />
  <Loading.Skeleton width="80%" />
</Card>

// 9. Loading overlay for sections
<Loading.Overlay loading={isLoading}>
  <DataTable data={data} />
</Loading.Overlay>

// 10. Table skeleton
<table>
  <tbody>
    {[1,2,3].map(i => (
      <tr key={i}>
        <td><Loading.Skeleton width="100%" /></td>
        <td><Loading.Skeleton width="100%" /></td>
        <td><Loading.Skeleton width="100%" /></td>
      </tr>
    ))}
  </tbody>
</table>

// 11. Conditional loading
{isLoading ? (
  <Loading variant="dots" text="Loading..." />
) : (
  <DataContent />
)}

// 12. In button
<Button isLoading>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
*/
