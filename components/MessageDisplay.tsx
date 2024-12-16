'use client';

import React, { useState } from 'react';
import SimpleNotification from './simpleNotification';
import { FiCheck, FiCopy } from 'react-icons/fi';

interface MessageDisplayProps {
  messages: { role: string; content: string }[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null); // Track which block is copied

  const copyToClipboard = async (code: string, index: number) => {
    try {
      if (!code) return; // Prevent copying empty content
      await navigator.clipboard.writeText(code.trim());
      setShowNotification(true); // Show notification
      setCopiedIndex(index); // Mark the copied block
      setTimeout(() => setCopiedIndex(null), 3000); // Reset copied state after 3 seconds
    } catch (error) {
      console.error('Failed to copy text:', error);
      alert('Failed to copy content. Please try again.');
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const result = [];
    let codeBlock: string[] = [];
    let insideCode = false;

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (insideCode) {
          // Closing code block
          const code = codeBlock.join('\n'); // Combine code lines
          const blockIndex = result.length; // Unique index for each block
          result.push(
            <div
              key={blockIndex}
              className="relative my-4 bg-primary-neutral-gray-700 text-gray-200 p-4 rounded-md"
            >
              <pre className="whitespace-pre-wrap text-sm">{code}</pre>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                onClick={() => copyToClipboard(code, blockIndex)} // Pass code and index
              >
                {copiedIndex === blockIndex ? (
                  <FiCheck size={18} className="text-green-400" />
                ) : (
                  <FiCopy size={18} />
                )}
              </button>
            </div>
          );
          codeBlock = []; // Reset the code block
        }
        insideCode = !insideCode; // Toggle code block mode
      } else if (insideCode) {
        codeBlock.push(line); // Add lines to the current code block
      } else {
        // Regular text
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
          className={`p-4 rounded-md ${message.role === 'assistant'
            ? 'bg-primary-neutral-gray-800 text-gray-200'
            : 'bg-primary-neutral-gray-850 text-right text-gray-300'
            }`}
        >
          {message.role === 'assistant' ? (
            <strong className="block text-crimson mb-2">AI:</strong>
          ) : (
            <strong dir="rtl" className="block text-right text-crimson mb-2">
              You Asked for
            </strong>
          )}
          {renderContent(message.content)}
        </div>
      ))}
      {/* Notification */}
      {showNotification && (
        <SimpleNotification
          message="Content copied to clipboard!"
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default MessageDisplay;
