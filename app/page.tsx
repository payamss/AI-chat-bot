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

  useEffect(() => {
    const loadModels = async () => {
      const fetchedModels = await fetchModels();
      setModels(fetchedModels);
      if (fetchedModels.length > 0) setSelectedModel(fetchedModels[0]);
    };
    loadModels();
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    const response = await sendMessage(selectedModel, userMessage);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-primary-neutral-gray-850 shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-crimson text-center">Chat App</h1>
      <Dropdown models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
      <div className="space-y-4">
        <MessageDisplay messages={messages} />
      </div>
      <ChatBox onSendMessage={handleSendMessage} />
    </div>
  );
}
