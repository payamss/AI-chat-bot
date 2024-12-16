'use client';

import React from 'react';

interface DropdownProps {
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ models, selectedModel, onModelChange }) => {
  return (
    <div className="relative">
      <label htmlFor="model-select" className="block text-gray-400 mb-2 text-sm">
        Select Model:
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="block w-full p-2.5 bg-primary-neutral-gray-800 text-gray-300 rounded-md border border-gray-700 focus:ring-2 focus:ring-crimson focus:outline-none"
      >
        {models.map((model) => (
          <option key={model} value={model} className="bg-primary-neutral-gray-900 text-gray-200">
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
