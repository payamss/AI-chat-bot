'use client';

import React, { useState } from 'react';
import SimpleNotification from './simpleNotification';
import { FiCheck, FiCopy } from 'react-icons/fi';
import Link from 'next/link';

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
    const urlRegex = /(https?:\/\/[^\s)]+)/g; // Regular expression to detect URLs
    const boldRegex = /\*\*(.*?)\*\*/g; // Regular expression to detect text between ** **
    const lines = content.split('\n'); // Split content into lines
    const result = [];
    let codeBlock: string[] = [];
    let insideCode = false;

    const getDomain = (url: string) => {
      try {
        const hostname = new URL(url).hostname; // Extract the domain name
        return hostname.replace(/^www\./, ''); // Remove "www." if it exists
      } catch {
        return url; // Fallback in case URL parsing fails
      }
    };


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
        // Process regular text
        const processedLine = line.split(urlRegex).map((part, index) => {
          if (urlRegex.test(part)) {
            // If part is a URL, display the domain name
            const cleanUrl = part.replace(/[()]/g, ''); // Remove parentheses
            const domain = getDomain(cleanUrl); // Extract domain
            return (
              <Link
                key={index}
                href={cleanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-crimson underline hover:text-red-400"
              >
                {domain}
              </Link>
            );
          } else {
            // Replace bold text with <strong>
            const boldedText = part.split(boldRegex).map((boldPart, boldIndex) => {
              if (boldIndex % 2 === 1) {
                // Odd index means it matches bold text
                return (
                  <strong key={boldIndex} className="font-bold text-white">
                    {boldPart}
                  </strong>
                );
              }
              return <span key={boldIndex}>{boldPart}</span>;
            });
            return boldedText;
          }
        });

        result.push(
          <p key={result.length} className="text-gray-300 text-justify text-pretty">
            {processedLine}
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
            ? 'bg-primary-neutral-gray-800 text-gray-200 rounded-xl'
            : 'bg-primary-neutral-gray-850 border rounded-xl border-primary-neutral-gray-700 text-gray-300'
            }`}
        >
          {message.role === 'assistant' ? (
            <strong className="block text-crimson mb-2">AI:</strong>
          ) : (
            <strong className="block text-crimson mb-2">Q:</strong>
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
