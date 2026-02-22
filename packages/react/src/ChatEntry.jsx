import React from 'react';

/** Renders an individual chat entry as a bubble.
 *
 * User input gets rendered on the right-hand side in a green bubble.
 * Responses from the model get rendered on the left-hand side in a blue bubble.
 * Both kinds get a timestamp underneath.
 * Line breaks and other whitespace are preserved.
 */
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
