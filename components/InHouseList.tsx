import React, { useState, useMemo } from 'react';
import { GroceryItem, Category } from '../types';
import { Plus, ShoppingCart, GripVertical, ArrowUpDown, Trash2, X } from 'lucide-react';
import { GroceryItemDisplay } from './GroceryItemDisplay';

type SortOption = 'default' | 'name' | 'category';

interface InHouseListProps {
  items: GroceryItem[];
  onUpdateQuantity: (itemId: string, newQuantity: { amount: number; unit: 'pcs' | 'g' }) => void;
  onMoveToShoppingList: (item: GroceryItem) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onAddItem: (name: string, category: Category, quantity: { amount: number; unit: 'pcs' | 'g' }) => void;
}

interface AddItemFormProps {
    onAdd: InHouseListProps['onAddItem'];
    onCancel: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd, onCancel }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Category>(Category.OTHER);
    const [amount, setAmount] = useState<number | string>(1);
    const [unit, setUnit] = useState<'pcs' | 'g'>('pcs');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
        if (name.trim() && !isNaN(numAmount) && numAmount > 0) {
            onAdd(name.trim(), category, { amount: numAmount, unit });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-gray-700 text-lg">Add New Item</h3>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item name" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" autoFocus required />
            <div className="grid grid-cols-3 gap-2">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))} placeholder="Qty" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500" required />
                <select value={unit} onChange={e => setUnit(e.target.value as 'pcs' | 'g')} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
                    <option value="pcs">pcs</option>
                    <option value="g">g</option>
                </select>
                <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 col-span-3 sm:col-span-1">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                 <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Add to Pantry
                </button>
                <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition font-semibold flex items-center justify-center gap-2">
                    <X className="w-5 h-5" /> Cancel
                </button>
            </div>
        </form>
    );
};


const InHouseList: React.FC<InHouseListProps> = ({ items, onUpdateQuantity, onMoveToShoppingList, onReorder, onDeleteItem, onAddItem }) => {
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
  
  const handleAddItemAndClose = (name: string, category: Category, quantity: { amount: number; unit: 'pcs' | 'g' }) => {
    onAddItem(name, category, quantity);
    setIsAdding(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">In House</h2>
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
        {items.length > 0 ? (
          sortedItems.map(item => (
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
                <GroceryItemDisplay name={item.name} category={item.category} />
              </div>
              <div className="flex items-center gap-2">
                 <input
                    type="number"
                    value={item.quantity?.amount ?? 0}
                    onChange={(e) => onUpdateQuantity(item.id, { amount: parseInt(e.target.value, 10) || 0, unit: item.quantity?.unit ?? 'pcs' })}
                    className="w-16 p-1.5 text-center font-semibold bg-white border border-gray-200 rounded-md"
                    aria-label={`Quantity of ${item.name}`}
                 />
                 <select
                    value={item.quantity?.unit ?? 'pcs'}
                    onChange={(e) => onUpdateQuantity(item.id, { amount: item.quantity?.amount ?? 0, unit: e.target.value as 'pcs' | 'g' })}
                    className="p-1.5 text-sm bg-white border border-gray-200 rounded-md"
                    aria-label={`Unit for ${item.name}`}
                 >
                    <option value="pcs">pcs</option>
                    <option value="g">g</option>
                 </select>
                <button
                  onClick={() => onMoveToShoppingList(item)}
                  className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                  title="Move to Shopping List"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
                 <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-full bg-gray-200 hover:bg-red-200 text-gray-600 hover:text-red-700 transition"
                    title={`Delete ${item.name}`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">Your pantry is empty.</p>
        )}
      </div>

       <div className="mt-6 border-t pt-4">
            {isAdding ? (
                <AddItemForm onAdd={handleAddItemAndClose} onCancel={() => setIsAdding(false)} />
            ) : (
                <button onClick={() => setIsAdding(true)} className="w-full bg-white text-gray-700 p-2 rounded-md hover:bg-gray-100 transition font-semibold flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-indigo-400">
                    <Plus className="w-5 h-5" /> Add New Item to Pantry
                </button>
            )}
        </div>
    </div>
  );
};

export default InHouseList;
