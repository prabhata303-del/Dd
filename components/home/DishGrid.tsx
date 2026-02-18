
import React from 'react';
import { Dish } from '../../types';
import DishCard from './DishCard';
import { PageId } from '../../App';

interface DishGridProps {
  dishes: Dish[];
  showProductDetail: (dishKey: string) => void;
}

const DishGrid: React.FC<DishGridProps> = ({ dishes, showProductDetail }) => {
  if (dishes.length === 0) {
    return (
      <p className="p-2.5 text-gray-600 w-full text-center">
        No dishes found for this selection or your Pincode.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 pb-5 overflow-x-hidden">
      {dishes.map((dish) => (
        <DishCard key={dish.key} dish={dish} showProductDetail={showProductDetail} />
      ))}
    </div>
  );
};

export default DishGrid;
