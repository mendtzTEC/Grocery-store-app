import React, { useState, useMemo } from 'react';
import { GroceryItem, Category } from '../types';
import { Check, Plus, GripVertical, ArrowUpDown, Trash2, X } from 'lucide-react';
import { GroceryItemDisplay } from './GroceryItemDisplay';

type SortOption = 'default' | 'name' | 'category';

interface ShoppingListProps {
  items: GroceryItem[];
  onMoveToInHouse: (item: GroceryItem) => void;
  onAddItem: (name: string, category: Category) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

const AddItemForm: React.FC<{ onAdd: (name: string, category: Category) => void; onCancel: () => void; }> = ({ onAdd, onCancel }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Category>(Category.OTHER);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim(), category);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-gray-700 text-lg">Add New Item</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item name" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 sm:col-span-2" autoFocus required />
                <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2">
                     <Plus className="w-5 h-5" /> Add to List
                </button>
                 <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition font-semibold flex items-center justify-center gap-2">
                    <X className="w-5 h-5" /> Cancel
                </button>
            </div>
        </form>
    )
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onMoveToInHouse, onAddItem, onReorder, onDeleteItem }) => {
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const sortedItems = useMemo(() => {
    const itemsCopy = [...items];
    if (sortOption === 'name') {
      return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortOption === 'category') {
      return itemsCopy.sort((a, b) => a.category.localeCompare(b.category));
    }
    return items; // Default order
  }, [items, sortOption]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== targetId) {
      onReorder(draggedItemId, targetId);
    }
    setDraggedItemId(null);
  };
  
  const handleAddItemAndClose = (name: string, category: Category) => {
    onAddItem(name, category);
    setIsAdding(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Shopping List</h2>
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="pl-3 pr-8 py-1.5 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="default">Default</option>
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
          </select>
          <ArrowUpDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div className="space-y-3">
        {sortedItems.map(item => (
          <div
            key={item.id}
            draggable={sortOption === 'default'}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragEnd={() => setDraggedItemId(null)}
            className={`flex items-center justify-between bg-gray-50 p-3 rounded-lg transition-opacity ${sortOption === 'default' ? 'cursor-grab' : 'cursor-default'} ${draggedItemId === item.id ? 'opacity-40' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-2">
              {sortOption === 'default' && <GripVertical className="w-5 h-5 text-gray-400" />}
              <GroceryItemDisplay name={item.name} category={item.category} isOneTime={!item.isStandard} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onMoveToInHouse(item)}
                className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition"
                title="Mark as purchased"
                aria-label={`Mark ${item.name} as purchased`}
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 rounded-full bg-gray-200 hover:bg-red-200 text-gray-600 hover:text-red-700 transition"
                title={`Delete ${item.name}`}
                aria-label={`Delete ${item.name}`}
                >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-500 text-center py-4">Your shopping list is empty.</p>}
      </div>

       <div className="mt-6 pt-4 border-t">
            {isAdding ? (
                <AddItemForm onAdd={handleAddItemAndClose} onCancel={() => setIsAdding(false)} />
            ) : (
                 <button onClick={() => setIsAdding(true)} className="w-full bg-white text-gray-700 p-2 rounded-md hover:bg-gray-100 transition font-semibold flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-indigo-400">
                    <Plus className="w-5 h-5" /> Add New Item to List
                </button>
            )}
        </div>
    </div>
  );
};

export default ShoppingList;