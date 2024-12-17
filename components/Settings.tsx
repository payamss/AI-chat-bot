'use client';

import React, { useState, useEffect } from 'react';
import { FiSettings, FiX } from 'react-icons/fi';

interface SettingsProps {
    currentUrl: string;
    onServerUrlChange: (newUrl: string) => void;
}

const LOCAL_STORAGE_KEY_SERVER_URL = 'chatbot_server_url';
const LOCAL_STORAGE_KEY_LOCAL_URL = 'chatbot_local_url';
const DEFAULT_LOCAL_URL = 'http://localhost:11434';

const Settings: React.FC<SettingsProps> = ({ currentUrl, onServerUrlChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [serverUrl, setServerUrl] = useState<string>(''); // Remote server URL
    const [localUrl, setLocalUrl] = useState<string>(DEFAULT_LOCAL_URL); // Default localhost URL
    const [isUsingLocalhost, setIsUsingLocalhost] = useState(currentUrl === localUrl);

    // Load stored values on mount
    useEffect(() => {
        const savedServerUrl = localStorage.getItem(LOCAL_STORAGE_KEY_SERVER_URL);
        const savedLocalUrl = localStorage.getItem(LOCAL_STORAGE_KEY_LOCAL_URL) || DEFAULT_LOCAL_URL;

        setServerUrl(savedServerUrl || '');
        setLocalUrl(savedLocalUrl);
        setIsUsingLocalhost(currentUrl === savedLocalUrl);
    }, [currentUrl]);

    // Save URLs to localStorage
    const saveUrls = (urlKey: string, urlValue: string) => {
        localStorage.setItem(urlKey, urlValue);
    };

    // Handle switch toggle between localhost and server
    const handleSwitchChange = () => {
        const useLocal = !isUsingLocalhost;
        setIsUsingLocalhost(useLocal);

        const newUrl = useLocal ? localUrl : serverUrl;
        onServerUrlChange(newUrl); // Update current URL in the app
    };

    // Handle saving the server URL
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (serverUrl.trim()) {
            saveUrls(LOCAL_STORAGE_KEY_SERVER_URL, serverUrl);
            if (!isUsingLocalhost) {
                onServerUrlChange(serverUrl); // Update URL if remote server is active
            }
            setIsOpen(false); // Close settings modal
        }
    };

    // Save local URL when edited
    const handleLocalUrlSave = () => {
        saveUrls(LOCAL_STORAGE_KEY_LOCAL_URL, localUrl);
        if (isUsingLocalhost) {
            onServerUrlChange(localUrl); // Update current URL if localhost is active
        }
    };

    return (
        <div className="fixed top-4 right-4 z-20">
            {/* Button with Scale Animation */}
            <button
                onClick={() => setIsOpen(true)}
                className={`p-2 rounded-full bg-primary-neutral-gray-700 text-gray-200 hover:bg-crimson 
        transition-transform duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                aria-label="Open Settings"
            >
                <FiSettings size={24} />
            </button>

            {/* Settings Modal with Scale and Opacity Animation */}
            <div
                className={`fixed top-4 right-4 bg-primary-neutral-gray-800 p-6 rounded-lg shadow-lg w-80 
        transform transition-all duration-300 origin-top-right 
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition"
                    aria-label="Close Settings"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-lg font-bold text-white mb-4">Settings</h2>

                {/* Switch Between Localhost and Server */}
                <div className="flex items-center justify-between mb-4">
                    <label htmlFor="localhostToggle" className="text-gray-400 text-sm">
                        Use Localhost:
                    </label>
                    <label htmlFor="localhostToggle" className="relative inline-flex items-center cursor-pointer">
                        <input
                            id="localhostToggle"
                            type="checkbox"
                            checked={isUsingLocalhost}
                            onChange={handleSwitchChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-crimson transition duration-300"></div>
                        <div className="absolute w-5 h-5 bg-white rounded-full left-1 peer-checked:translate-x-5 transition duration-300"></div>
                    </label>
                </div>

                {/* Localhost URL */}
                {isUsingLocalhost && (
                    <div className="space-y-2">
                        <label htmlFor="localUrl" className="text-gray-400 text-sm">
                            Localhost URL:
                        </label>
                        <input
                            type="text"
                            id="localUrl"
                            value={localUrl}
                            onChange={(e) => setLocalUrl(e.target.value)}
                            onBlur={handleLocalUrlSave} // Save on blur
                            placeholder="Enter localhost URL"
                            className="w-full px-3 py-2 rounded-md bg-primary-neutral-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-crimson"
                        />
                    </div>
                )}

                {/* Server URL */}
                {!isUsingLocalhost && (
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <label htmlFor="serverUrl" className="text-gray-400 text-sm">
                            Ollama Server URL:
                        </label>
                        <input
                            type="text"
                            id="serverUrl"
                            value={serverUrl}
                            onChange={(e) => setServerUrl(e.target.value)}
                            placeholder="Enter server URL"
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
        </div>
    );
};

export default Settings;
