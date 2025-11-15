import React, { useState, useCallback } from 'react';
import { GroceryItem, Recipe } from '../types';
import { generateRecipe, RecipeRequest } from '../services/geminiService';
import { ChefHat, Sparkles, Loader2, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RecipeGeneratorProps {
  inHouseItems: GroceryItem[];
  onSaveRecipe: (recipe: Omit<Recipe, 'id'>) => void;
}

type OptionType = 'time' | 'method' | 'diet' | 'calories' | 'protein';
type Strictness = 'loose' | 'strict';

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ inHouseItems, onSaveRecipe }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [options, setOptions] = useState<Omit<RecipeRequest, 'ingredients' | 'strictness'>>({
    time: '30',
    method: 'Any',
    diet: 'Anything',
    calories: 'Normal',
    protein: 'Normal',
  });
  const [strictness, setStrictness] = useState<Strictness>('loose');
  const [recipe, setRecipe] = useState<Omit<Recipe, 'id'> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleItemToggle = (itemName: string) => {
    setSelectedItems(prev =>
      prev.includes(itemName) ? prev.filter(i => i !== itemName) : [...prev, itemName]
    );
  };

  const handleOptionChange = (type: OptionType, value: string) => {
    setOptions(prev => ({ ...prev, [type]: value }));
  };

  const handleGenerateRecipe = useCallback(async () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one ingredient.');
      return;
    }
    setError('');
    setIsLoading(true);
    setRecipe(null);
    try {
      const result = await generateRecipe({ ...options, ingredients: selectedItems, strictness });
      setRecipe(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate recipe. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedItems, options, strictness]);
  
  const OptionSelector: React.FC<{label: string, type: OptionType, values: string[], helpText?: string}> = ({label, type, values, helpText}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            value={options[type]}
            onChange={(e) => handleOptionChange(type, e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
            {values.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ChefHat className="w-7 h-7" />
        Recipe Genius
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select ingredients:</label>
          <div className="max-h-32 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-md border">
            {inHouseItems.length > 0 ? (
                inHouseItems.map(item => (
                <div key={item.id} className="flex items-center">
                  <input
                    id={`item-${item.id}`}
                    type="checkbox"
                    checked={selectedItems.includes(item.name)}
                    onChange={() => handleItemToggle(item.name)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`item-${item.id}`} className="ml-3 block text-sm text-gray-900">
                    {item.name}
                  </label>
                </div>
              ))
            ) : (
                <p className="text-sm text-gray-500 text-center">Add items to your 'In House' list first.</p>
            )}
          </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Ingredient Usage</label>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-md bg-gray-200 p-1">
                <button onClick={() => setStrictness('loose')} className={`px-3 py-1 text-sm font-medium rounded ${strictness === 'loose' ? 'bg-white text-gray-900 shadow' : 'bg-transparent text-gray-600'}`}>
                    Loose
                </button>
                 <button onClick={() => setStrictness('strict')} className={`px-3 py-1 text-sm font-medium rounded ${strictness === 'strict' ? 'bg-white text-gray-900 shadow' : 'bg-transparent text-gray-600'}`}>
                    Strict
                </button>
            </div>
             <p className="mt-1 text-xs text-gray-500">Loose allows new ingredients, Strict uses only yours.</p>
        </div>


        <OptionSelector label="Cooking Time (minutes)" type="time" values={['15', '30', '45', '60']} />
        <OptionSelector label="Cooking Method" type="method" values={['Any', 'Air Fryer', 'Baking', 'Boiling', 'Frying']} />
        <OptionSelector label="Diet" type="diet" values={['Anything', 'Vegetarian', 'Meat', 'Fish']} />
        <OptionSelector label="Calories" type="calories" values={['Normal', 'Low Calorie', 'High Calorie']} />
        <OptionSelector label="Protein" type="protein" values={['Normal', 'Low Protein', 'High Protein']} />

        <button
          onClick={handleGenerateRecipe}
          disabled={isLoading || selectedItems.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Recipe
            </>
          )}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {recipe && (
        <div className="mt-6 border-t pt-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{recipe.name}</h3>
              <p className="text-sm text-gray-600 italic mt-1">{recipe.description}</p>
            </div>
             <button
                onClick={() => onSaveRecipe(recipe)}
                className="flex items-center gap-2 bg-white text-gray-700 font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-gray-100 transition border border-gray-200 text-sm"
            >
                <Save className="w-4 h-4 text-indigo-500" />
                Save
            </button>
          </div>
           
           <div>
             <h4 className="font-semibold text-gray-700 mb-2">Ingredients</h4>
             <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 bg-gray-50 p-3 rounded-md">
                {recipe.ingredients.map((ing, index) => <li key={index}>{ing.name}</li>)}
             </ul>
           </div>
           
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Instructions</h4>
              <div className="prose prose-sm max-w-none prose-indigo">
                 <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
