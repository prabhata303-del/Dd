
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'google' | 'ghost';
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'w-full py-4 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center';
  let variantStyles = '';
  let shadowStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-primary-gradient text-white';
      shadowStyles = 'shadow-purple-lg';
      break;
    case 'secondary':
      variantStyles = 'bg-white text-primary border border-gray-200';
      shadowStyles = 'shadow-md';
      break;
    case 'danger':
      variantStyles = 'bg-danger text-white';
      shadowStyles = 'shadow-md';
      break;
    case 'google':
      variantStyles = 'bg-white text-gray-700 border border-gray-200';
      shadowStyles = 'shadow-md';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-primary hover:bg-gray-100';
      shadowStyles = '';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${shadowStyles} ${className} ${
        (disabled || isLoading) ? 'opacity-60 cursor-not-allowed shadow-none' : ''
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
