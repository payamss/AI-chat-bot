'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AiFillStop } from 'react-icons/ai';
import { BiSend } from 'react-icons/bi';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

interface ChatBoxProps {
  onSendMessage: (message: string, controller: AbortController) => Promise<void>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_ROWS = isFullScreen ? 25 : 6;
  const [rows, setRows] = useState(2);

  // Dynamically adjust textarea height
  const adjustTextAreaRows = () => {
    if (textAreaRef.current) {
      const currentRows = message.split('\n').length;
      setRows(Math.min(MAX_ROWS, currentRows));
    }
  };

  useEffect(() => {
    adjustTextAreaRows();
  }, [message, isFullScreen]);

  const startNewRequest = async () => {
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      await onSendMessage(message, controller);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request stopped.');
      } else {
        console.error('Error:', error);
      }
    } finally {
      setIsSending(false);
      controllerRef.current = null;
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSending) {
      controllerRef.current?.abort();
      setIsSending(false);
      return;
    }

    if (message.trim()) {
      setIsSending(true);
      await startNewRequest();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    setTimeout(() => textAreaRef.current?.focus(), 0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative transition-all duration-500 p-0 m-0 ${isFullScreen
        ? '   z-50 rounded-xl '
        : 'rounded-xl '
        }`}
    >
      {/* Fullscreen Toggle Button */}
      <button
        type="button"
        onClick={toggleFullScreen}
        className={`absolute  text-red-800 hover:text-crimson transition-transform duration-500 z-10 ${isFullScreen
          ? '   top-2 right-6 '
          : '-top-3 -right-2 '}`}
        aria-label="Toggle Fullscreen"
      >
        {isFullScreen ? <FiMinimize size={24} /> : <FiMaximize size={24} />}
      </button>

      {/* Textarea Input */}

      <textarea
        ref={textAreaRef}
        rows={rows}
        value={message}
        onKeyDown={handleKeyDown}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isSending ? 'Stopping request...' : 'Ask a question...'}
        className="w-full h-full relative bg-primary-neutral-gray-800 text-gray-200 rounded-xl pr-20 px-4 py-3 focus:ring-1 focus:ring-crimson focus:outline-none scrollbar-thin scrollbar-thumb-crimson transition-all duration-500  leading-loose text-sm sm:text-base "
        disabled={isSending}
        style={{
          maxHeight: isFullScreen ? '95vh' : '30vh',
        }}
      />


      {/* Send/Stop Button */}
      <button
        type="submit"
        className={`absolute bottom-1 right-0 py-3 px-4 rounded-xl text-white transition-all duration-500 opacity-100 ${isSending ? 'bg-crimson hover:bg-red-700' : 'bg-crimson hover:opacity-80'
          }`}
        aria-label={isSending ? 'Stop' : 'Send'}


      >
        <div className="flex justify-between">        {isSending ? "Stop" : "Send"}
          {isSending ? <AiFillStop size={24} /> : <BiSend size={24} />}</div>

      </button>
    </form>
  );
};

export default ChatBox;
