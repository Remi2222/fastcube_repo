import React, { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash, FaSearch, FaTimes } from 'react-icons/fa';

const Input = forwardRef(({
  type = 'text',
  variant = 'default',
  size = 'md',
  label,
  placeholder,
  error,
  success,
  warning,
  disabled = false,
  required = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  clearable = false,
  searchable = false,
  className = '',
  onClear,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(props.value || props.defaultValue || '');

  // Handle input change
  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Handle clear input
  const handleClear = () => {
    setInputValue('');
    if (onClear) {
      onClear();
    }
    // Trigger onChange with empty value
    if (props.onChange) {
      const event = {
        target: { value: '', name: props.name }
      };
      props.onChange(event);
    }
  };

  // Determine input type
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Base input classes
  const baseClasses = `
    w-full transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    ${fullWidth ? 'w-full' : ''}
  `;

  // Variant classes
  const variantClasses = {
    default: `
      bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-white
      focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-offset-gray-900
      hover:border-gray-400 dark:hover:border-gray-500
    `,
    filled: `
      bg-gray-50 dark:bg-gray-700 border border-transparent
      text-gray-900 dark:text-white
      focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-offset-gray-900
      hover:bg-gray-100 dark:hover:bg-gray-600
    `,
    outline: `
      bg-transparent border-2 border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-white
      focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-offset-gray-900
      hover:border-gray-400 dark:hover:border-gray-500
    `,
    ghost: `
      bg-transparent border border-transparent
      text-gray-900 dark:text-white
      focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-offset-gray-900
      hover:bg-gray-50 dark:hover:bg-gray-700
    `,
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-4 py-3 text-base rounded-xl',
    xl: 'px-5 py-4 text-lg rounded-xl',
  };

  // Status classes
  const statusClasses = {
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
    warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500',
  };

  // Status colors
  const statusColors = {
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
  };

  // Final input classes
  const finalInputClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${error ? statusClasses.error : ''}
    ${success ? statusClasses.success : ''}
    ${warning ? statusClasses.warning : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Input wrapper classes
  const wrapperClasses = `
    relative ${fullWidth ? 'w-full' : ''}
  `;

  // Label classes
  const labelClasses = `
    block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2
    ${error ? statusColors.error : ''}
    ${success ? statusColors.success : ''}
    ${warning ? statusColors.warning : ''}
  `;

  // Error message classes
  const errorClasses = `
    mt-2 text-sm ${statusColors.error || 'text-gray-600 dark:text-gray-400'}
  `;

  return (
    <div className={wrapperClasses}>
      {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}

        {/* Search Icon (if searchable) */}
        {searchable && !leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <FaSearch className="w-4 h-4" />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${finalInputClasses}
            ${leftIcon || searchable ? 'pl-10' : ''}
            ${rightIcon || clearable || (type === 'password') ? 'pr-10' : ''}
          `}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </button>
        )}

        {/* Clear Button */}
        {clearable && inputValue && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            onClick={handleClear}
            tabIndex={-1}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error/Success/Warning Message */}
      {(error || success || warning) && (
        <p className={errorClasses}>
          {error || success || warning}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
