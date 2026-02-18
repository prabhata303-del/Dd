
import React from 'react';

interface DiscountTagProps {
  discount: number;
  className?: string;
}

const DiscountTag: React.FC<DiscountTagProps> = ({ discount, className }) => {
  if (discount <= 0) return null;

  return (
    <div className={`absolute top-1.5 right-1.5 bg-danger text-white p-0.5 rounded-full w-[35px] h-[35px] flex justify-center items-center text-xs font-bold z-10 shadow-md leading-none ${className}`}>
      -{discount}%
    </div>
  );
};

export default DiscountTag;
