
import React from 'react';
import { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  onShowAllDishes: () => void;
  activeCategory: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory, onShowAllDishes, activeCategory }) => {
  return (
    <div className="horizontal-scroll flex overflow-x-auto pb-5 gap-4 scroll-smooth scrollbar-hide">
      <div
        className={`flex-shrink-0 w-[90px] h-[90px] bg-white rounded-xl shadow-md cursor-pointer flex flex-col justify-center items-center p-1.5 text-center border-2 transition-all duration-200 
          ${activeCategory === 'ALL' ? 'border-primary shadow-purple-button bg-purple-50' : 'border-transparent'}`}
        onClick={onShowAllDishes}
      >
        <i className="fas fa-list text-primary text-3xl mb-0.5"></i>
        <h4 className="text-xs font-semibold m-0 text-text-color whitespace-nowrap overflow-hidden text-ellipsis w-full">All</h4>
      </div>

      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`flex-shrink-0 w-[90px] h-[90px] bg-white rounded-xl shadow-md cursor-pointer flex flex-col justify-center items-center p-1.5 text-center border-2 transition-all duration-200 
            ${activeCategory === cat.id ? 'border-primary shadow-purple-button bg-purple-50' : 'border-transparent'}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.imageUrl ? (
            <img src={cat.imageUrl} alt={cat.name} className="w-[60px] h-[60px] object-contain mb-0.5 rounded-none" />
          ) : (
            <i className="fas fa-utensils text-primary text-3xl mb-0.5"></i>
          )}
          <h4 className="text-xs font-semibold m-0 text-text-color whitespace-nowrap overflow-hidden text-ellipsis w-full">{cat.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
