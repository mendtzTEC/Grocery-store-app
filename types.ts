export enum Category {
  PRODUCE = 'Produce',
  DAIRY = 'Dairy & Eggs',
  MEAT = 'Meat & Poultry',
  FISH = 'Fish & Seafood',
  BAKERY = 'Bakery & Bread',
  PANTRY = 'Pantry',
  FROZEN = 'Frozen Foods',
  BEVERAGES = 'Beverages',
  OTHER = 'Other',
}

export interface GroceryItem {
  id: string;
  name: string;
  category: Category;
  quantity?: {
    amount: number;
    unit: 'pcs' | 'g';
  };
  isStandard: boolean;
}

export interface NormalizedGroceryItem extends Omit<GroceryItem, 'id' | 'isStandard'> {
  normalizedName: string;
}

export interface RecipeIngredient {
  name: string; // e.g. "2 cups Flour"
  normalizedName: string; // e.g. "flour"
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string; // Markdown formatted
}
