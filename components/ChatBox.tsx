'use client';

import React, { useState } from 'react';

interface ChatBoxProps {
  onSendMessage: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <textarea
        rows={3}
        className="w-full bg-primary-neutral-gray-800 text-gray-200 rounded-md border border-gray-700 px-4 py-2 focus:ring-2 focus:ring-crimson focus:outline-none resize-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask a question..."
      />
      <button
        type="submit"
        className="bg-crimson text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Send
      </button>
    </form>
  );
};

export default ChatBox;
