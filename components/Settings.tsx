'use client';

import React, { useState } from 'react';
import { FiSettings, FiX } from 'react-icons/fi'; // Import icons for settings and close button

interface SettingsProps {
    serverUrl: string;
    onServerUrlChange: (newUrl: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ serverUrl, onServerUrlChange }) => {
    const [isOpen, setIsOpen] = useState(false); // Track open/close state
    const [newUrl, setNewUrl] = useState(serverUrl); // Local state for URL input

    const toggleSettings = () => {
        setIsOpen((prev) => !prev); // Toggle visibility
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUrl.trim()) {
            onServerUrlChange(newUrl); // Pass updated server URL to parent
            setIsOpen(false); // Close settings after save
        }
    };

    return (
        <div className="fixed top-4 right-4 z-20">
            {/* Icon Button */}
            {!isOpen && (
                <button
                    onClick={toggleSettings}
                    className="p-2 rounded-full bg-primary-neutral-gray-700 text-gray-200 hover:bg-crimson transition duration-300"
                    aria-label="Open Settings"
                >
                    <FiSettings size={24} />
                </button>
            )}

            {/* Expanded Settings Form */}
            {isOpen && (
                <div className="relative bg-primary-neutral-gray-800 p-4 rounded-lg shadow-lg w-80">
                    {/* Close Button */}
                    <button
                        onClick={toggleSettings}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                        aria-label="Close Settings"
                    >
                        <FiX size={20} />
                    </button>

                    <h2 className="text-lg font-bold text-white mb-4">Settings</h2>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <label htmlFor="serverUrl" className="text-gray-400 text-sm">
                            Ollama Server URL:
                        </label>
                        <input
                            type="text"
                            id="serverUrl"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="Enter Ollama server URL"
                            className="w-full px-3 py-2 rounded-md bg-primary-neutral-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-crimson"
                        />

                        <button
                            type="submit"
                            className="w-full px-3 py-2 bg-crimson text-white rounded-md hover:bg-red-600 transition"
                        >
                            Save
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Settings;
