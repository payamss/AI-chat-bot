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
    <div className="p-8 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Chat App</h1>
      <Dropdown models={models} selectedModel={selectedModel} onModelChange={setSelectedModel} />
      <MessageDisplay messages={messages} />
      <ChatBox onSendMessage={handleSendMessage} />
    </div>
  );
}
