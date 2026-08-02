import React from 'react';
import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  hover = true,
  className = '',
  ...props
}, ref) => {
  // Base card classes
  const baseClasses = `
    bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
    transition-all duration-300 overflow-hidden
    ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
  `;

  // Variant classes
  const variantClasses = {
    default: 'shadow-md',
    elevated: 'shadow-lg',
    flat: 'shadow-none',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-white/20 dark:border-gray-700/20',
    gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900',
    brand: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700',
  };

  // Size classes
  const sizeClasses = {
    sm: 'rounded-lg p-4',
    md: 'rounded-xl p-6',
    lg: 'rounded-2xl p-8',
    xl: 'rounded-3xl p-10',
  };

  // Final classes
  const finalClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      ref={ref}
      className={finalClasses}
      {...props}
    >
      {children}
    </div>
  );
});

// Card sub-components
const CardHeader = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const CardBody = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const CardFooter = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const CardTitle = forwardRef(({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}, ref) => {
  return React.createElement(Component, {
    ref,
    className: `text-lg font-semibold text-gray-900 dark:text-white mb-2 ${className}`,
    ...props
  }, children);
});

const CardSubtitle = forwardRef(({
  children,
  as: Component = 'p',
  className = '',
  ...props
}, ref) => {
  return React.createElement(Component, {
    ref,
    className: `text-sm text-gray-600 dark:text-gray-400 ${className}`,
    ...props
  }, children);
});

const CardDescription = forwardRef(({
  children,
  as: Component = 'p',
  className = '',
  ...props
}, ref) => {
  return React.createElement(Component, {
    ref,
    className: `text-gray-600 dark:text-gray-400 leading-relaxed ${className}`,
    ...props
  }, children);
});

// Add display names
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardSubtitle.displayName = 'CardSubtitle';
CardDescription.displayName = 'CardDescription';

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Description = CardDescription;

export default Card;
