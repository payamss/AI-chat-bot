'use client';

import { useEffect, useState, useRef } from 'react';
import Dropdown from '../components/Dropdown';
import ChatBox from '../components/ChatBox';
import MessageDisplay from '../components/MessageDisplay';
import Settings from '../components/Settings';
import { fetchModels, sendMessage } from '../lib/api';

const LOCAL_STORAGE_KEY = 'chatbot_settings';

export default function Home() {
  const [models, setModels] = useState<string[]>([]); // List of available models
  const [selectedModel, setSelectedModel] = useState<string>(''); // Track selected model
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]); // Chat messages
  const [thinkingMessage, setThinkingMessage] = useState(''); // Thinking overlay message
  const [loading, setLoading] = useState(false); // Loading state
  const [serverUrl, setServerUrl] = useState<string>('http://localhost:11434'); // Default server URL
  const controllerRef = useRef<AbortController | null>(null); // Ref to handle AbortController

  // Load settings (serverUrl and selectedModel) from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSettings) {
      const { serverUrl: savedUrl, selectedModel: savedModel } = JSON.parse(savedSettings);
      if (savedUrl) setServerUrl(savedUrl); // Set the saved server URL
      if (savedModel) setSelectedModel(savedModel); // Set the saved model
    }
  }, []);

  // Fetch models when serverUrl changes
  useEffect(() => {
    const loadModels = async () => {
      try {
        const fetchedModels = await fetchModels(serverUrl); // Fetch models from the API
        setModels(fetchedModels); // Update available models

        // Select the first model if no model is currently selected
        if (fetchedModels.length > 0 && !selectedModel) {
          const defaultModel = fetchedModels[0];
          setSelectedModel(defaultModel);

          // Save the default model and server URL to localStorage
          localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
              serverUrl,
              selectedModel: defaultModel,
            })
          );
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };
    loadModels();
  }, [serverUrl, selectedModel]);

  // Save settings (serverUrl and selectedModel) to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        serverUrl,
        selectedModel,
      })
    );
  }, [serverUrl, selectedModel]);

  // Handle message sending
  const handleSendMessage = async (userMessage: string) => {
    if (loading) {
      // Abort the current request if already loading
      controllerRef.current?.abort();
      setThinkingMessage('');
      setLoading(false);
      return;
    }

    const newMessage = { role: 'user', content: userMessage }; // Construct user message
    setMessages((prev) => [...prev, newMessage]); // Add the user message to the chat
    setThinkingMessage('Thinking...');
    setLoading(true);

    const controller = new AbortController(); // Create a new AbortController for this request
    controllerRef.current = controller;

    try {
      const response = await sendMessage(
        selectedModel,
        [...messages, newMessage], // Include full chat history
        controller,
        serverUrl
      );
      const assistantMessage = { role: 'assistant', content: response }; // Construct assistant message
      setMessages((prev) => [...prev, assistantMessage]); // Add the assistant message to the chat
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted by the user.');
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Request stopped by the user.' },
        ]);
      } else {
        console.error('Error fetching response:', error);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'An error occurred. Please try again.' },
        ]);
      }
    } finally {
      setThinkingMessage(''); // Clear thinking overlay
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="h-screen flex flex-col bg-primary-neutral-gray-850 text-gray-200 relative">
      {/* Dropdown fixed at the top-left */}
      <div className="fixed top-4 left-4 z-10">
        <Dropdown
          models={models}
          selectedModel={selectedModel}
          onModelChange={(model) => setSelectedModel(model)} // Save selected model
        />
      </div>

      {/* Settings Button */}
      <Settings
        currentUrl={serverUrl} // Pass the currently active URL
        onServerUrlChange={(newUrl) => {
          setServerUrl(newUrl); // Dynamically update the active server URL
          setSelectedModel(''); // Reset selected model to refresh
        }}
      />

      <div className="flex-1 overflow-y-auto p-4 mt-16 mb-52">
        <MessageDisplay messages={messages} />
      </div>

      {/* ChatBox fixed at the bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-primary-neutral-gray-850 p-4 shadow-2xl">
        <ChatBox onSendMessage={(message) => handleSendMessage(message)} />
      </div>

      {/* Thinking Message Overlay */}
      {thinkingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-20 h-[80%]">
          <div className="bg-primary-neutral-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-white text-lg font-bold mb-4">Processing...</h2>
            <p className="text-xl text-crimson animate-pulse">{thinkingMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
