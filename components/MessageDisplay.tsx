'use client';

import React, { useState, useEffect } from 'react';
import SimpleNotification from './simpleNotification';
import { FiCheck, FiCopy, FiClock, FiPlay } from 'react-icons/fi';
import Link from 'next/link';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // Import a predefined theme

interface MessageDisplayProps {
  messages: {
    role: string;
    content: string;
    model?: string; // Model name for assistant responses
    total_duration?: number; // Total response duration in nanoseconds
  }[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [output, setOutput] = useState<{ [key: number]: string | null }>({}); // Output storage for each code block

  useEffect(() => {
    // Automatically highlight all code blocks after render
    hljs.highlightAll();
  }, [messages]);

  const copyToClipboard = async (code: string, index: number) => {
    try {
      if (!code) return;
      await navigator.clipboard.writeText(code.trim());
      setShowNotification(true);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 3000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const runCode = async (code: string, index: number) => {
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setOutput((prev) => ({ ...prev, [index]: data.output || 'Error running the code.' }));
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput((prev) => ({ ...prev, [index]: 'Error running the code.' }));
    }
  };

  const renderContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s)]+)/g;
    const boldRegex = /\*\*(.*?)\*\*/g;

    const lines = content.split('\n');
    const result = [];
    let codeBlock: string[] = [];
    let insideCode = false;
    let language = 'plaintext';

    const getDomain = (url: string) => {
      try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, '');
      } catch {
        return url;
      }
    };

    const detectLanguage = (line: string) => {
      const match = line.match(/^```(\w+)/);
      return match ? match[1] : 'plaintext';
    };

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (insideCode) {
          const code = codeBlock.join('\n');
          const blockIndex = result.length;

          result.push(
            <div
              key={blockIndex}
              className="relative my-4 bg-primary-neutral-gray-700 text-gray-200 pt-2 rounded-md"
            >
              {/* Display Language */}
              <div className="text-xs text-gray-400 mb-2 pl-4">Language: {language}</div>

              {/* Syntax Highlighted Code */}
              <pre>
                <code className={`hljs language-${language}`}>{code}</code>
              </pre>

              {/* Buttons */}
              <div className="absolute top-2 right-2 flex gap-2 pr-2">
                {/* Copy Button */}
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => copyToClipboard(code, blockIndex)}
                >
                  {copiedIndex === blockIndex ? (
                    <FiCheck size={18} className="text-green-400" />
                  ) : (
                    <FiCopy size={18} />
                  )}
                </button>

                {/* Run Button */}
                {language === 'python' && (
                  <button
                    className="text-gray-400 hover:text-green-400"
                    onClick={() => runCode(code, blockIndex)}
                  >
                    <FiPlay size={18} />
                  </button>
                )}
              </div>

              {/* Code Output */}
              {output[blockIndex] && (
                <div className="mt-4 p-2 bg-gray-800 text-gray-300 rounded">
                  <strong>Output:</strong>
                  <pre className="whitespace-pre-wrap mt-2">{output[blockIndex]}</pre>
                </div>
              )}
            </div>
          );

          codeBlock = [];
          insideCode = false;
        } else {
          language = detectLanguage(line);
          insideCode = true;
        }
      } else if (insideCode) {
        codeBlock.push(line);
      } else {
        const processedLine = line.split(urlRegex).map((part, index) => {
          if (urlRegex.test(part)) {
            const cleanUrl = part.replace(/[()]/g, '');
            const domain = getDomain(cleanUrl);
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
            const boldedText = part.split(boldRegex).map((boldPart, boldIndex) => {
              if (boldIndex % 2 === 1) {
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

  const formatDuration = (nanoseconds: number) => {
    const seconds = (nanoseconds / 1e9).toFixed(2);
    return `${seconds} seconds`;
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
            <div className="flex justify-between mb-2">
              <strong className="block text-crimson">
                {message.model || 'AI'}:
              </strong>
              {message.total_duration && (
                <span className="flex items-center text-gray-400 text-sm">
                  <FiClock className="mr-1" /> {formatDuration(message.total_duration)}
                </span>
              )}
            </div>
          ) : (
            <strong className="block text-crimson mb-2">Q:</strong>
          )}
          {renderContent(message.content)}
        </div>
      ))}
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
