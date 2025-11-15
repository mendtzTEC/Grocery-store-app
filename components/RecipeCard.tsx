import React, { useState } from 'react';
import { Recipe } from '../types';
import { ChevronDown, Trash2, ListPlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (recipeId: string) => void;
  onAddMissing: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete, onAddMissing }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border flex flex-col">
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{recipe.name}</h3>
        <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">{recipe.description}</p>
      </div>

      {isExpanded && (
        <div className="p-4 border-t space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Ingredients</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 bg-gray-50 p-3 rounded-md">
              {recipe.ingredients.map((ing, index) => <li key={index}>{ing.name}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Instructions</h4>
            <div className="prose prose-sm max-w-none prose-indigo">
              <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      <div className="border-t p-2 mt-auto bg-gray-50/50 rounded-b-2xl flex items-center justify-between">
         <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-indigo-600 p-2 rounded-md transition"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => onAddMissing(recipe)}
            title="Add missing ingredients to shopping list"
            className="p-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            <ListPlus className="w-5 h-5" />
          </button>
           <button 
            onClick={() => onDelete(recipe.id)}
            title="Delete recipe"
            className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
