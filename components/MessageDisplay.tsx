'use client';

import React, { useState } from 'react';
import SimpleNotification from './simpleNotification';

interface MessageDisplayProps {
  messages: { role: string; content: string }[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
    const [showNotification, setShowNotification] = useState(false);

  const copyToClipboard = async (code: string) => {
    try {
       await navigator.clipboard.writeText(code);
        setShowNotification(true); // Show notification
      } catch (error) {
        console.error('Failed to copy text:', error);
        alert('Failed to copy payment address. Please try again.');
      }

  };

  const renderContent = (content: string) => {
    // Split text into lines and identify code blocks
    const lines = content.split('\n');
    const result = [];
    let codeBlock: string[] = [];
    let insideCode = false;

    for (let line of lines) {
      if (line.startsWith('```')) {
        if (insideCode) {
          result.push(
            <div
              key={result.length}
              className="bg-gray-800 text-gray-100 p-4 rounded-md relative"
            >
              <pre className="whitespace-pre-wrap">{codeBlock.join('\n')}</pre>
              <button
                className="absolute top-2 right-2 bg-crimson text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => copyToClipboard(codeBlock.join('\n'))}
              >
                Copy
              </button>
            </div>
          );
          codeBlock = [];
        }
        insideCode = !insideCode;
      } else if (insideCode) {
        codeBlock.push(line);
      } else {
        result.push(
          <p key={result.length} className="text-gray-300">
            {line}
          </p>
        );
      }
    }

    return result;
  };

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-md ${
            message.role === 'assistant'
              ? 'bg-primary-neutral-gray-800 text-gray-100'
              : 'bg-primary-neutral-gray-900 text-gray-300'
          }`}
        >
          <strong className="block text-crimson mb-2">{message.role}:</strong>
          {renderContent(message.content)}
        </div>
      ))}
        {/* Notification */}
        {showNotification && (
                  <SimpleNotification
                    message="Wallet address copied to clipboard"
                    onClose={() => setShowNotification(false)}
                  />
                )}
    </div>
  );
};

export default MessageDisplay;
