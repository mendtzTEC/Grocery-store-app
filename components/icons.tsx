
import React from 'react';
import { Carrot, Milk, Drumstick, Fish, Wheat, ShoppingBasket, Snowflake, Coffee, HelpCircle, Beef } from 'lucide-react';
import { Category } from '../types';

interface CategoryIconProps {
  category: Category;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5' }) => {
  switch (category) {
    case Category.PRODUCE:
      return <Carrot className={className} />;
    case Category.DAIRY:
      return <Milk className={className} />;
    case Category.MEAT:
      return <Drumstick className={className} />;
    case Category.FISH:
        return <Fish className={className} />;
    case Category.BAKERY:
      return <Wheat className={className} />;
    case Category.PANTRY:
      return <ShoppingBasket className={className} />;
    case Category.FROZEN:
      return <Snowflake className={className} />;
    case Category.BEVERAGES:
      return <Coffee className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
