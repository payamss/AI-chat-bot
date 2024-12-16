/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
import Dropdown from '../components/Dropdown';
import ChatBox from '../components/ChatBox';
import MessageDisplay from '../components/MessageDisplay';
import { fetchModels, sendMessage } from '../lib/api';

export default function Home() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [thinkingMessage, setThinkingMessage] = useState(''); // Thinking message state
  const [loading, setLoading] = useState(false); // Track loading state
  const controllerRef = useRef<AbortController | null>(null); // Ref to handle AbortController

  // Load available models on mount
  useEffect(() => {
    const loadModels = async () => {
      const fetchedModels = await fetchModels();
      setModels(fetchedModels);
      if (fetchedModels.length > 0) setSelectedModel(fetchedModels[0]);
    };
    loadModels();
  }, []);

  // Handle message sending
  const handleSendMessage = async (userMessage: string) => {
    if (loading) {
      // If a message is already loading, abort the previous request
      controllerRef.current?.abort();
      setThinkingMessage('');
      setLoading(false);
      return;
    }

    const newMessage = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, newMessage]);
    setThinkingMessage('Thinking...');
    setLoading(true);

    // Create a new AbortController
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // Send the request with the updated chat history
      const response = await sendMessage(selectedModel, [...messages, newMessage], controller);
      const assistantMessage = { role: 'assistant', content: response };

      setMessages((prev) => [...prev, assistantMessage]);
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
      setThinkingMessage('');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-primary-neutral-gray-850 text-gray-200 relative">
      {/* Dropdown fixed at the top-left */}
      <div className="fixed top-4 left-4 z-10">
        <Dropdown models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
      </div>

      {/* Scrollable MessageDisplay Area */}
      <div className="flex-1 overflow-y-auto p-4 mt-16 mb-52">
        <MessageDisplay messages={messages} />
      </div>

      {/* ChatBox fixed at the bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-primary-neutral-gray-800 p-4 shadow-lg">
        <ChatBox
          onSendMessage={(message) => handleSendMessage(message)}
        />
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
