'use client';

import React, { useEffect, useState } from 'react';

interface DropdownProps {
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ models, selectedModel, onModelChange }) => {
  return (
    <div className="relative">
      <select
        className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
