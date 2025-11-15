import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GroceryItem, Category, Recipe } from './types';
import InHouseList from './components/InHouseList';
import ShoppingList from './components/ShoppingList';
import RecipeGenerator from './components/RecipeGenerator';
import { Header } from './components/Header';
import ImportRecipeModal from './components/ImportRecipeModal';
import MyRecipes from './components/MyRecipes';

const App: React.FC = () => {
  const [view, setView] = useState<'lists' | 'recipes'>('lists');

  const [inHouseItems, setInHouseItems] = useLocalStorage<GroceryItem[]>('inHouseItems', []);
  const [shoppingListItems, setShoppingListItems] = useLocalStorage<GroceryItem[]>('shoppingListItems', []);
  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>('recipes', []);

  const [isImportModalOpen, setImportModalOpen] = useState(false);

  const handleMoveToShoppingList = useCallback((item: GroceryItem) => {
    setInHouseItems(prev => prev.filter(i => i.id !== item.id));
    setShoppingListItems(prev => [...prev, { ...item, quantity: undefined }]);
  }, [setInHouseItems, setShoppingListItems]);

  const handleMoveToInHouse = useCallback((item: GroceryItem) => {
    setShoppingListItems(prev => prev.filter(i => i.id !== item.id));
    if (item.isStandard) {
      setInHouseItems(prev => [...prev, { ...item, quantity: { amount: 1, unit: 'pcs' } }]);
    }
  }, [setInHouseItems, setShoppingListItems]);

  const handleUpdateQuantity = useCallback((itemId: string, newQuantity: { amount: number; unit: 'pcs' | 'g' }) => {
    setInHouseItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: { amount: Math.max(0, newQuantity.amount), unit: newQuantity.unit } } : item
      )
    );
  }, [setInHouseItems]);

  const handleAddShoppingItem = useCallback((name: string, category: Category) => {
    const newItem: GroceryItem = {
      id: `onetime-${Date.now()}`,
      name,
      category,
      isStandard: false,
    };
    setShoppingListItems(prev => [newItem, ...prev]);
  }, [setShoppingListItems]);

  const handleAddInHouseItem = useCallback((name: string, category: Category, quantity: { amount: number, unit: 'pcs' | 'g' }) => {
    const newItem: GroceryItem = {
      id: `onetime-${Date.now()}`,
      name,
      category,
      quantity,
      isStandard: false,
    };
    setInHouseItems(prev => [newItem, ...prev]);
  }, [setInHouseItems]);
  
  const handleDeleteItem = useCallback((list: 'inHouse' | 'shopping', itemId: string) => {
    if (list === 'inHouse') {
        setInHouseItems(prev => prev.filter(item => item.id !== itemId));
    } else {
        setShoppingListItems(prev => prev.filter(item => item.id !== itemId));
    }
  }, [setInHouseItems, setShoppingListItems]);


  const handleReorder = (
    setList: React.Dispatch<React.SetStateAction<GroceryItem[]>>,
    draggedId: string,
    targetId: string
  ) => {
    setList(prev => {
      const draggedIndex = prev.findIndex(item => item.id === draggedId);
      const targetIndex = prev.findIndex(item => item.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newItems = [...prev];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      return newItems;
    });
  };

  const handleAddImportedItems = useCallback((items: Omit<GroceryItem, 'id' | 'isStandard'>[]) => {
    const newItems: GroceryItem[] = items.map(item => ({
      ...item,
      id: `imported-${Date.now()}-${item.name}`,
      isStandard: false
    }));

    setShoppingListItems(prev => {
      const existingNames = new Set(prev.map(i => i.name.toLowerCase()));
      const uniqueNewItems = newItems.filter(i => !existingNames.has(i.name.toLowerCase()));
      return [...prev, ...uniqueNewItems];
    });
    setImportModalOpen(false);

  }, [setShoppingListItems])

  const handleSaveRecipe = useCallback((recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe-${Date.now()}`,
    };
    setSavedRecipes(prev => [newRecipe, ...prev]);
    // Optionally, switch view to recipes after saving
    setView('recipes');
  }, [setSavedRecipes]);

  const handleDeleteRecipe = useCallback((recipeId: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
  }, [setSavedRecipes]);

  const handleAddMissingIngredientsToShoppingList = useCallback((recipe: Recipe) => {
    const inHouseLower = inHouseItems.map(i => i.name.toLowerCase());
    const shoppingListLower = shoppingListItems.map(i => i.name.toLowerCase());

    const missingIngredients = recipe.ingredients.filter(ingredient => {
      const normalized = ingredient.normalizedName.toLowerCase();
      const alreadyHave = inHouseLower.some(pantryItem => pantryItem.includes(normalized)) ||
                          shoppingListLower.some(listItem => listItem.includes(normalized));
      return !alreadyHave;
    });

    const newShoppingItems: GroceryItem[] = missingIngredients.map(ing => ({
      id: `recipe-needed-${Date.now()}-${ing.normalizedName}`,
      name: ing.name,
      category: Category.OTHER, // Default category, could be improved
      isStandard: false,
    }));
    
    setShoppingListItems(prev => [...prev, ...newShoppingItems]);
    setView('lists'); // Switch to lists view to see the added items
  }, [inHouseItems, shoppingListItems, setShoppingListItems]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
            onOpenImportModal={() => setImportModalOpen(true)} 
            view={view}
            onSetView={setView}
        />

        <main className="mt-8">
          {view === 'lists' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InHouseList
                    items={inHouseItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onMoveToShoppingList={handleMoveToShoppingList}
                    onReorder={(draggedId, targetId) => handleReorder(setInHouseItems, draggedId, targetId)}
                    onDeleteItem={(itemId) => handleDeleteItem('inHouse', itemId)}
                    onAddItem={handleAddInHouseItem}
                  />
                  <ShoppingList
                    items={shoppingListItems}
                    onMoveToInHouse={handleMoveToInHouse}
                    onAddItem={handleAddShoppingItem}
                    onReorder={(draggedId, targetId) => handleReorder(setShoppingListItems, draggedId, targetId)}
                    onDeleteItem={(itemId) => handleDeleteItem('shopping', itemId)}
                  />
                </div>

                <div className="lg:col-span-1">
                  <RecipeGenerator inHouseItems={inHouseItems} onSaveRecipe={handleSaveRecipe} />
                </div>
            </div>
          )}
          {view === 'recipes' && (
            <MyRecipes 
              recipes={savedRecipes}
              onDeleteRecipe={handleDeleteRecipe}
              onAddMissingIngredients={handleAddMissingIngredientsToShoppingList}
            />
          )}
        </main>
      </div>
      {isImportModalOpen && (
        <ImportRecipeModal
          onClose={() => setImportModalOpen(false)}
          onAddItems={handleAddImportedItems}
          inHouseItems={inHouseItems}
          shoppingListItems={shoppingListItems}
        />
      )}
    </div>
  );
};

export default App;