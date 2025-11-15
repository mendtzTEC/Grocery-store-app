import React, { useState, useCallback, useEffect } from 'react';
import { X, Loader2, Sparkles, Plus, Home } from 'lucide-react';
import { generateShoppingListFromRecipe } from '../services/geminiService';
import { GroceryItem, Category, NormalizedGroceryItem } from '../types';
import { GroceryItemDisplay } from './GroceryItemDisplay';

interface ImportRecipeModalProps {
    onClose: () => void;
    onAddItems: (items: Omit<GroceryItem, 'id' | 'isStandard'>[]) => void;
    inHouseItems: GroceryItem[];
    shoppingListItems: GroceryItem[];
}

type GeneratedItem = NormalizedGroceryItem & { checked: boolean; owned: boolean };

const ImportRecipeModal: React.FC<ImportRecipeModalProps> = ({ onClose, onAddItems, inHouseItems, shoppingListItems }) => {
    const [recipeText, setRecipeText] = useState('');
    const [servings, setServings] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);

    const [ownedItemNames, setOwnedItemNames] = useState<Set<string>>(new Set());

    useEffect(() => {
        const inHouseLower = inHouseItems.map(i => i.name.toLowerCase());
        const shoppingListLower = shoppingListItems.map(i => i.name.toLowerCase());
        setOwnedItemNames(new Set([...inHouseLower, ...shoppingListLower]));
    }, [inHouseItems, shoppingListItems]);


    const handleGenerate = useCallback(async () => {
        if (!recipeText.trim()) {
            setError('Please paste a recipe.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedItems([]);
        try {
            const items = await generateShoppingListFromRecipe(recipeText, servings);
            
            const processedItems = items.map(item => {
                 const normalized = item.normalizedName.toLowerCase();
                 const isOwned = Array.from(ownedItemNames).some(ownedItem => ownedItem.includes(normalized));
                 return { ...item, checked: !isOwned, owned: isOwned };
            });

            setGeneratedItems(processedItems);

        } catch (e) {
            // Fix: Catch block now safely handles unknown error types.
            if (e instanceof Error) {
                setError(e.message || 'An unknown error occurred.');
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [recipeText, servings, ownedItemNames]);

    const handleToggleItem = (itemName: string) => {
        setGeneratedItems(prev => 
            prev.map(item => item.name === itemName ? {...item, checked: !item.checked} : item)
        );
    };

    const handleAddClick = () => {
        const itemsToAdd = generatedItems.filter(item => item.checked);
        onAddItems(itemsToAdd);
    };

    const checkedCount = generatedItems.filter(item => item.checked).length;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Import Recipe for Shopping List</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </header>

                <main className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="recipe-text" className="block text-sm font-medium text-gray-700 mb-1">
                            Paste your recipe here
                        </label>
                        <textarea
                            id="recipe-text"
                            rows={8}
                            value={recipeText}
                            onChange={(e) => setRecipeText(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., 2 cups flour, 1 tsp baking soda..."
                        />
                    </div>
                    <div>
                        <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                            Number of servings
                        </label>
                        <input
                            id="servings"
                            type="number"
                            min="1"
                            value={servings}
                            onChange={(e) => setServings(Math.max(1, parseInt(e.target.value, 10)))}
                            className="w-32 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {isLoading ? 'Generating...' : 'Generate Shopping List'}
                    </button>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {generatedItems.length > 0 && (
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Generated Items</h3>
                            <p className="text-sm text-gray-600 mb-3">We've unchecked items you might already have.</p>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {generatedItems.map((item, index) => (
                                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${item.owned ? 'bg-green-50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={item.checked}
                                                onChange={() => handleToggleItem(item.name)}
                                                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <GroceryItemDisplay name={item.name} category={item.category as Category} />
                                        </div>
                                        {item.owned && (
                                            <div className="flex items-center gap-1 text-xs text-green-700 bg-green-200 px-2 py-1 rounded-full">
                                                <Home className="w-3 h-3"/>
                                                <span>Owned</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
                
                {generatedItems.length > 0 && (
                     <footer className="p-4 border-t bg-gray-50 rounded-b-2xl">
                        <button
                            onClick={handleAddClick}
                            disabled={checkedCount === 0}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-green-300"
                        >
                            <Plus className="w-5 h-5" />
                            Add {checkedCount} item(s) to Shopping List
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default ImportRecipeModal;