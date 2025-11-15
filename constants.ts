
import { GroceryItem, Category } from './types';

export const STANDARD_ITEMS: GroceryItem[] = [
  // Produce
  { id: 'item-1', name: 'Apples', category: Category.PRODUCE, isStandard: true },
  { id: 'item-5', name: 'Bananas', category: Category.PRODUCE, isStandard: true },
  { id: 'item-6', name: 'Carrots', category: Category.PRODUCE, isStandard: true },
  { id: 'item-7', name: 'Onions', category: Category.PRODUCE, isStandard: true },
  { id: 'item-8', name: 'Lettuce', category: Category.PRODUCE, isStandard: true },
  { id: 'item-9', name: 'Tomatoes', category: Category.PRODUCE, isStandard: true },

  // Dairy
  { id: 'item-3', name: 'Milk', category: Category.DAIRY, isStandard: true },
  { id: 'item-10', name: 'Eggs', category: Category.DAIRY, isStandard: true },
  { id: 'item-11', name: 'Cheese', category: Category.DAIRY, isStandard: true },
  { id: 'item-12', name: 'Yogurt', category: Category.DAIRY, isStandard: true },
  { id: 'item-13', name: 'Butter', category: Category.DAIRY, isStandard: true },

  // Meat
  { id: 'item-4', name: 'Chicken Breast', category: Category.MEAT, isStandard: true },
  { id: 'item-14', name: 'Ground Beef', category: Category.MEAT, isStandard: true },
  { id: 'item-15', name: 'Bacon', category: Category.MEAT, isStandard: true },

  // Fish
  { id: 'item-27', name: 'Salmon', category: Category.FISH, isStandard: true },
  { id: 'item-28', name: 'Tuna', category: Category.FISH, isStandard: true },

  // Bakery
  { id: 'item-2', name: 'Bread', category: Category.BAKERY, isStandard: true },
  { id: 'item-16', name: 'Baguette', category: Category.BAKERY, isStandard: true },

  // Pantry
  { id: 'item-17', name: 'Pasta', category: Category.PANTRY, isStandard: true },
  { id: 'item-18', name: 'Rice', category: Category.PANTRY, isStandard: true },
  { id: 'item-19', name: 'Flour', category: Category.PANTRY, isStandard: true },
  { id: 'item-20', name: 'Sugar', category: Category.PANTRY, isStandard: true },
  { id: 'item-21', name: 'Olive Oil', category: Category.PANTRY, isStandard: true },
  { id: 'item-22', name: 'Cereal', category: Category.PANTRY, isStandard: true },

  // Frozen
  { id: 'item-23', name: 'Frozen Pizza', category: Category.FROZEN, isStandard: true },
  { id: 'item-24', name: 'Ice Cream', category: Category.FROZEN, isStandard: true },

  // Beverages
  { id: 'item-25', name: 'Coffee', category: Category.BEVERAGES, isStandard: true },
  { id: 'item-26', name: 'Orange Juice', category: Category.BEVERAGES, isStandard: true },
];
