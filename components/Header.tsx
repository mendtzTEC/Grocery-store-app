import React from 'react';
import { Sparkles, ClipboardPaste, Users, List, BookHeart } from 'lucide-react';

interface HeaderProps {
  onOpenImportModal: () => void;
  currentUser: string;
  onUserChange: (user: string) => void;
  view: 'lists' | 'recipes';
  onSetView: (view: 'lists' | 'recipes') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenImportModal, currentUser, onUserChange, view, onSetView }) => {
  const navButtonClasses = (buttonView: 'lists' | 'recipes') => 
    `flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
      view === buttonView 
        ? 'bg-indigo-600 text-white shadow' 
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <header className="text-center relative">
      <div className="absolute top-0 right-0 flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-500" />
        <select
          value={currentUser}
          onChange={(e) => onUserChange(e.target.value)}
          className="bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Select user account"
        >
          <option value="User A">User A</option>
          <option value="User B">User B</option>
          <option value="Guest">Guest</option>
        </select>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
        Grocery Genius
      </h1>
      <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto flex items-center justify-center gap-2">
        Your smart pantry assistant, powered by Gemini <Sparkles className="w-5 h-5 text-yellow-500" />
      </p>
      <div className="mt-6 flex justify-center gap-2 border border-gray-200 p-1 rounded-lg bg-gray-100/60 w-fit mx-auto">
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
