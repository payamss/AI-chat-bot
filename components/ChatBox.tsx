'use client';

import React, { useState } from 'react';

interface ChatBoxProps {
  onSendMessage: (message: string, controller: AbortController) => Promise<void>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState(''); // Track input value
  const [isSending, setIsSending] = useState(false); // Track loading state
  const controllerRef = React.useRef<AbortController | null>(null); // Ref for AbortController

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSending) {
      // If already sending, abort the request
      controllerRef.current?.abort();
      setIsSending(false);
      controllerRef.current = null;
      console.log('Request aborted.');
      return;
    }

    if (message.trim()) {
      // Start new message request
      const controller = new AbortController();
      controllerRef.current = controller;
      setIsSending(true);

      try {
        await onSendMessage(message, controller);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Request was aborted.');
        } else {
          console.error('Error sending message:', error);
        }
      } finally {
        setIsSending(false);
        controllerRef.current = null;
        setMessage(''); // Clear input field
      }
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      {/* Message Input */}
      <textarea
        rows={3}
        className="w-full bg-primary-neutral-gray-800 text-gray-200 rounded-md border border-gray-700 px-4 py-2 focus:ring-2 focus:ring-crimson focus:outline-none resize-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isSending ? 'Sending message...' : 'Ask a question...'}
        disabled={isSending} // Disable input while sending
      />

      {/* Submit/Stop Button */}
      <button
        type="submit"
        className={`w-full px-4 py-2 rounded-md text-white transition ${isSending
            ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
            : 'bg-crimson hover:bg-red-600'
          }`}
      >
        {isSending ? 'Stop' : 'Send'}
      </button>
    </form>
  );
};

export default ChatBox;
