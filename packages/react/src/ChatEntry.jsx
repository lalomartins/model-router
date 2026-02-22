import React from 'react';

export const ChatEntry = ({ entry }) => {
  if (!entry) return null;

  const formatTimestamp = (ts) => {
    try {
      return ts instanceof Date ? ts.toLocaleString() : new Date(ts).toLocaleString();
    } catch (e) {
      return String(ts);
    }
  };

  const rowClass = `chat-row ${entry.isPrompt ? 'prompt' : 'response'}`;
  const bubbleClass = `bubble ${entry.isPrompt ? 'prompt-bubble' : 'response-bubble'}`;

  return (
    <div className={rowClass}>
      <div className={bubbleClass}>
        <div className="text">{entry.text}</div>
      </div>
      <div className="ts">{formatTimestamp(entry.timestamp)}</div>
    </div>
  );
};

ChatEntry.displayName = 'ChatEntry';
