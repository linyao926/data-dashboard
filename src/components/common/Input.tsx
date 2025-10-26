// src/components/common/Input.tsx
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2 border rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${
                hasError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              ${className}
            `}
            disabled={disabled}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, fullWidth = false, className = '', disabled, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${
              hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${className}
          `}
          disabled={disabled}
          {...props}
        />

        {hasError && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {!hasError && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select variant
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, fullWidth = false, options, className = '', disabled, ...props },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${
              hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${className}
          `}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasError && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {!hasError && helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Object.assign(Input, {
  Textarea,
  Select,
});

/* 
USAGE EXAMPLES:

// 1. Simple input
<Input placeholder="Enter your name" />

// 2. With label
<Input label="Email" type="email" placeholder="john@example.com" />

// 3. With error
<Input 
  label="Password" 
  type="password" 
  error="Password must be at least 8 characters"
/>

// 4. With helper text
<Input 
  label="Username" 
  helperText="Choose a unique username"
/>

// 5. With icons
<Input 
  leftIcon={<span>🔍</span>}
  placeholder="Search..."
/>

<Input 
  label="Email"
  leftIcon={<span>📧</span>}
  rightIcon={<span>✓</span>}
/>

// 6. Required field
<Input label="Name" required />

// 7. Disabled
<Input label="Email" value="john@example.com" disabled />

// 8. Full width
<Input label="Address" fullWidth />

// 9. With ref (for form libraries like react-hook-form)
const emailRef = useRef<HTMLInputElement>(null);
<Input ref={emailRef} label="Email" />

// 10. Textarea
<Input.Textarea 
  label="Description" 
  rows={4}
  placeholder="Enter description..."
/>

// 11. Textarea with error
<Input.Textarea 
  label="Bio"
  error="Bio is required"
  rows={3}
/>

// 12. Select dropdown
<Input.Select
  label="Category"
  options={[
    { value: '', label: 'Select category' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
  ]}
/>

// 13. Select with error
<Input.Select
  label="Country"
  options={countries}
  error="Please select a country"
/>

// 14. In a form
<form>
  <Input 
    label="Name" 
    required 
    fullWidth 
    className="mb-4"
  />
  <Input 
    label="Email" 
    type="email" 
    required 
    fullWidth 
    className="mb-4"
  />
  <Input.Textarea 
    label="Message" 
    required 
    fullWidth 
    rows={4}
  />
  <Button type="submit">Submit</Button>
</form>

// 15. With react-hook-form
import { useForm } from 'react-hook-form';

const { register, formState: { errors } } = useForm();

<Input 
  label="Email"
  {...register('email', { required: 'Email is required' })}
  error={errors.email?.message}
/>
*/
