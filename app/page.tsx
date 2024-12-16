'use client';

import { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import ChatBox from '../components/ChatBox';
import MessageDisplay from '../components/MessageDisplay';
import { fetchModels, sendMessage } from '../lib/api';

export default function Home() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [, setLoading] = useState(false); // Track loading state
  const [thinkingMessage, setThinkingMessage] = useState(''); // Thinking message state

  useEffect(() => {
    const loadModels = async () => {
      const fetchedModels = await fetchModels();
      setModels(fetchedModels);
      if (fetchedModels.length > 0) setSelectedModel(fetchedModels[0]);
    };
    loadModels();
  }, []);

  const handleSendMessage = async (userMessage: string, controller: AbortController) => {
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setThinkingMessage('Thinking...'); // Set thinking message
    setLoading(true);

    try {
      const response = await sendMessage(selectedModel, userMessage, controller);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
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
      setLoading(false);
      setThinkingMessage(''); // Clear thinking message
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-primary-neutral-gray-850 shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-crimson text-center">Your ASsiStanT</h1>
      <Dropdown models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
      <div className="space-y-4">
        <MessageDisplay messages={messages} />
        {thinkingMessage && (
          <p className="text-center text-gray-400 animate-pulse">{thinkingMessage}</p>
        )}
      </div>
      <ChatBox onSendMessage={(message) => handleSendMessage(message, new AbortController())} />
    </div>
  );
}
