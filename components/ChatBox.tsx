'use client';

import React, { useState, useRef } from 'react';

interface ChatBoxProps {
  onSendMessage: (message: string, controller: AbortController) => Promise<void>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState(''); // Input value
  const [isSending, setIsSending] = useState(false); // Tracks if a request is in progress
  const controllerRef = useRef<AbortController | null>(null); // Persistent reference for AbortController

  const startNewRequest = async () => {
    // Initialize AbortController for this request
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // Call the parent onSendMessage function
      await onSendMessage(message, controller);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was manually stopped by the user.');
      } else {
        console.error('Error sending message:', error);
      }
    } finally {
      setIsSending(false); // Reset sending state
      controllerRef.current = null; // Cleanup AbortController
      setMessage(''); // Clear the input field
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSending) {
      // If currently sending, abort the request
      console.log('Stopping current request...');
      controllerRef.current?.abort('User stopped the request'); // Provide a clear abort reason
      setIsSending(false);
      return;
    }

    if (message.trim()) {
      setIsSending(true); // Set loading state
      await startNewRequest(); // Start a new request
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      {/* Input Field */}
      <textarea
        rows={3}
        className="w-full bg-primary-neutral-gray-800 text-gray-200 rounded-md border border-gray-700 px-4 py-2 focus:ring-2 focus:ring-crimson focus:outline-none resize-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isSending ? 'Stopping request...' : 'Ask a question...'}
        disabled={isSending} // Disable input while sending
      />

      {/* Send/Stop Button */}
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
