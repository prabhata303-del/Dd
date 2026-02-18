
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-primary', className }) => {
  let spinnerSize = '';
  switch (size) {
    case 'sm':
      spinnerSize = 'w-5 h-5';
      break;
    case 'md':
      spinnerSize = 'w-8 h-8';
      break;
    case 'lg':
      spinnerSize = 'w-12 h-12';
      break;
  }

  return (
    <div
      className={`animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${spinnerSize} ${color} ${className}`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default Spinner;
