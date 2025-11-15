import React from 'react';
import { Category } from '../types';
import { CategoryIcon } from './icons';

interface GroceryItemDisplayProps {
  name: string;
  category: Category;
  isOneTime?: boolean;
}

const categoryColors: Record<Category, string> = {
    [Category.PRODUCE]: 'bg-green-100 text-green-800',
    [Category.DAIRY]: 'bg-blue-100 text-blue-800',
    [Category.MEAT]: 'bg-red-100 text-red-800',
    [Category.FISH]: 'bg-cyan-100 text-cyan-800',
    [Category.BAKERY]: 'bg-yellow-100 text-yellow-800',
    [Category.PANTRY]: 'bg-indigo-100 text-indigo-800',
    [Category.FROZEN]: 'bg-sky-100 text-sky-800',
    [Category.BEVERAGES]: 'bg-purple-100 text-purple-800',
    [Category.OTHER]: 'bg-gray-100 text-gray-800',
};


export const GroceryItemDisplay: React.FC<GroceryItemDisplayProps> = ({ name, category, isOneTime }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${categoryColors[category]}`}>
        <CategoryIcon category={category} className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-700">{name}</span>
        {isOneTime && (
            <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full w-fit">One-time</span>
        )}
      </div>
    </div>
  );
};
