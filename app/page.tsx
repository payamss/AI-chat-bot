'use client';

import { useEffect, useState, useRef } from 'react';
import Dropdown from '../components/Dropdown';
import ChatBox from '../components/ChatBox';
import MessageDisplay from '../components/MessageDisplay';
import Settings from '../components/Settings';
import { fetchModels, sendMessage } from '../lib/api';

export default function Home() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [thinkingMessage, setThinkingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState<string>(
    process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434'
  );
  const controllerRef = useRef<AbortController | null>(null);

  // Load available models when serverUrl changes
  useEffect(() => {
    const loadModels = async () => {
      try {
        const fetchedModels = await fetchModels(serverUrl);
        setModels(fetchedModels);
        if (fetchedModels.length > 0) setSelectedModel(fetchedModels[0]);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    };
    loadModels();
  }, [serverUrl]);

  const handleSendMessage = async (userMessage: string) => {
    if (loading) {
      controllerRef.current?.abort();
      setThinkingMessage('');
      setLoading(false);
      return;
    }

    const newMessage = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, newMessage]);
    setThinkingMessage('Thinking...');
    setLoading(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await sendMessage(
        selectedModel,
        [...messages, newMessage],
        controller,
        serverUrl
      );
      const assistantMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
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

      {/* Settings Button */}
      <Settings serverUrl={serverUrl} onServerUrlChange={setServerUrl} />

      {/* Scrollable MessageDisplay Area */}
      <div className="flex-1 overflow-y-auto p-4 mt-16 mb-52">
        <MessageDisplay messages={messages} />
      </div>

      {/* ChatBox fixed at the bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-primary-neutral-gray-800 p-4 shadow-lg">
        <ChatBox onSendMessage={(message) => handleSendMessage(message)} />
      </div>

      {/* Thinking Message Overlay */}
      {thinkingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-20">
          <div className="bg-primary-neutral-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-white text-lg font-bold mb-4">Processing...</h2>
            <p className="text-xl text-crimson animate-pulse">{thinkingMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
