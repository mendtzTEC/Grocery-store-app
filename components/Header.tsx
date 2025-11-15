
import React from 'react';
import { Sparkles, ClipboardPaste, List, BookHeart } from 'lucide-react';

interface HeaderProps {
  onOpenImportModal: () => void;
  view: 'lists' | 'recipes';
  onSetView: (view: 'lists' | 'recipes') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenImportModal, view, onSetView }) => {
  const navButtonClasses = (buttonView: 'lists' | 'recipes') => 
    `flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
      view === buttonView 
        ? 'bg-indigo-600 text-white shadow' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <header className="text-center relative">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
        Grocery Genius
      </h1>
      <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto flex items-center justify-center gap-2">
        Your smart pantry assistant, powered by Gemini <Sparkles className="w-5 h-5 text-yellow-500" />
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2 border border-gray-200 p-1 rounded-lg bg-gray-100/60 w-fit mx-auto">
          <button onClick={() => onSetView('lists')} className={navButtonClasses('lists')}>
            <List className="w-4 h-4" /> My Lists
          </button>
          <button onClick={() => onSetView('recipes')} className={navButtonClasses('recipes')}>
            <BookHeart className="w-4 h-4" /> My Recipes
          </button>
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-2 bg-white text-gray-700 font-semibold py-2 px-3 rounded-md hover:bg-gray-100 transition border-l"
            title="Import Recipe"
          >
            <ClipboardPaste className="w-5 h-5 text-indigo-500" />
          </button>
      </div>
    </header>
  );
};