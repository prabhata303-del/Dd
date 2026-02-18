
import React from 'react';

interface QuantityControlsProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  className?: string;
  buttonVariant?: 'primary' | 'secondary';
  showLabel?: boolean;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  className = '',
  buttonVariant = 'primary',
  showLabel = false,
}) => {
  const buttonClasses = buttonVariant === 'primary'
    ? 'bg-white border-2 border-primary text-primary shadow-sm'
    : 'bg-white border border-gray-200 text-primary shadow-sm';

  return (
    <div className={`flex items-center gap-2 bg-gray-50 p-1 px-2 rounded-full ${className}`}>
      {showLabel && <span className="text-sm font-medium mr-2">Qty:</span>}
      <button
        onClick={onDecrease}
        className={`w-6 h-6 rounded-full cursor-pointer font-bold flex items-center justify-center transition-colors duration-200 ${buttonClasses}`}
      >
        <i className="fas fa-minus text-xs"></i>
      </button>
      <span className="text-base font-semibold text-text-color">{quantity}</span>
      <button
        onClick={onIncrease}
        className={`w-6 h-6 rounded-full cursor-pointer font-bold flex items-center justify-center transition-colors duration-200 ${buttonClasses}`}
      >
        <i className="fas fa-plus text-xs"></i>
      </button>
    </div>
  );
};

export default QuantityControls;
