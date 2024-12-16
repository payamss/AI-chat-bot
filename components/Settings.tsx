'use client';

import React, { useState, useEffect } from 'react';
import { FiSettings, FiX } from 'react-icons/fi';

interface SettingsProps {
    serverUrl: string;
    onServerUrlChange: (newUrl: string) => void;
}

const LOCAL_STORAGE_KEY = 'ollama_settings';

const Settings: React.FC<SettingsProps> = ({ serverUrl, onServerUrlChange }) => {
    const [isOpen, setIsOpen] = useState(false); // Track open/close state
    const [newUrl, setNewUrl] = useState(serverUrl); // Local state for URL input
    const [useLocalhost, setUseLocalhost] = useState(serverUrl === 'http://localhost:11434'); // Track localhost usage

    // Load saved settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedSettings) {
            const { useLocalhost: savedUseLocalhost, serverUrl: savedUrl } = JSON.parse(savedSettings);
            setUseLocalhost(savedUseLocalhost);
            setNewUrl(savedUrl || 'http://localhost:11434');
            if (savedUseLocalhost) {
                onServerUrlChange('http://localhost:11434'); // Use localhost
            } else if (savedUrl) {
                onServerUrlChange(savedUrl); // Use saved custom URL
            }
        }
    }, [onServerUrlChange]);

    // Save settings to localStorage
    const saveSettings = (useLocal: boolean, url: string) => {
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
                useLocalhost: useLocal,
                serverUrl: url,
            })
        );
    };

    // Toggle localhost or custom URL
    const handleSwitchChange = () => {
        const useLocal = !useLocalhost; // Toggle localhost state
        setUseLocalhost(useLocal);

        if (useLocal) {
            const localhostUrl = 'http://localhost:11434';
            onServerUrlChange(localhostUrl);
            saveSettings(true, localhostUrl);
        } else {
            saveSettings(false, newUrl); // Save current custom URL to localStorage
        }
    };

    // Save the custom server URL
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!useLocalhost && newUrl.trim()) {
            onServerUrlChange(newUrl); // Update the custom server URL
            saveSettings(false, newUrl); // Save the custom URL to localStorage
            setIsOpen(false); // Close the settings form
        }
    };

    const toggleSettings = () => {
        setIsOpen((prev) => !prev); // Toggle settings visibility
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

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">Use Localhost:</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useLocalhost}
                                onChange={handleSwitchChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-crimson transition duration-300"></div>
                            <div className="absolute w-5 h-5 bg-white rounded-full left-1 peer-checked:translate-x-5 transition duration-300"></div>
                        </label>
                    </div>

                    {/* URL Input Form */}
                    {!useLocalhost && (
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
                    )}
                </div>
            )}
        </div>
    );
};

export default Settings;
