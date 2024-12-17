'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface DropdownProps {
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ models, selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative w-64">
      {/* Dropdown Toggle Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 bg-primary-neutral-gray-800 text-gray-300 rounded-md border border-gray-700 hover:bg-primary-neutral-gray-700 focus:outline-none transition-transform duration-300"
      >
        <span>{selectedModel || 'Select a Model'}</span>
        {isOpen ? (
          <FiChevronUp size={20} className="text-crimson transition-transform duration-300" />
        ) : (
          <FiChevronDown size={20} className="text-crimson transition-transform duration-300" />
        )}
      </button>

      {/* Dropdown List */}
      <div
        className={`absolute top-full left-0 mt-2 w-full bg-primary-neutral-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden 
        transform transition-all duration-300 origin-top 
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        <ul className="max-h-60 overflow-y-auto">
          {models.map((model) => (
            <li
              key={model}
              onClick={() => {
                onModelChange(model);
                setIsOpen(false); // Close dropdown on selection
              }}
              className={`px-4 py-2 text-gray-300 cursor-pointer hover:bg-primary-neutral-gray-700 transition`}
            >
              {`Model: ${model}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
