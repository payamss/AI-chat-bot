import React from 'react';

interface MessageDisplayProps {
  messages: { role: string; content: string }[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-md ${
            message.role === 'assistant'
              ? 'bg-blue-100 text-blue-900'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <strong>{message.role}:</strong> {message.content}
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay;
