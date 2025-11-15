import React from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { BookHeart } from 'lucide-react';

interface MyRecipesProps {
  recipes: Recipe[];
  onDeleteRecipe: (recipeId: string) => void;
  onAddMissingIngredients: (recipe: Recipe) => void;
}

const MyRecipes: React.FC<MyRecipesProps> = ({ recipes, onDeleteRecipe, onAddMissingIngredients }) => {
  return (
    <div className="space-y-6">
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onDelete={onDeleteRecipe}
              onAddMissing={onAddMissingIngredients}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg border">
          <BookHeart className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">Your Recipe Book is Empty</h3>
          <p className="mt-2 text-gray-500">
            Generate a recipe with the Recipe Genius and save it to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
