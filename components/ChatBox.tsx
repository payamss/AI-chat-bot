'use client';

import React, { useState } from 'react';

interface ChatBoxProps {
  onSendMessage: (message: string, controller: AbortController) => Promise<void>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      // If loading, abort the request
      controller?.abort();
      setLoading(false);
      setController(null);
    } else if (message.trim()) {
      // Send new request
      const newController = new AbortController();
      setController(newController);
      setLoading(true);

      try {
        await onSendMessage(message, newController);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Request aborted.');
        } else {
          console.error('Error:', error);
        }
      } finally {
        setLoading(false);
        setController(null);
      }
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
        disabled={loading}
      />
      <button
        type="submit"
        className={`w-full px-4 py-2 rounded-md text-white transition ${loading ? 'bg-red-600 hover:bg-red-700' : 'bg-crimson hover:bg-red-600'
          }`}
      >
        {loading ? 'Stop' : 'Send'}
      </button>
    </form>
  );
};

export default ChatBox;
