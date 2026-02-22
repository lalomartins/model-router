import React from 'react';
import { ChatHistory } from './ChatHistory';
import { PromptForm } from './PromptForm';
import './RouterChat.css';

/** Wraps chat history and prompt form in a simple layout.
 */
export const RouterChat = ({ chat }) => {
  return (
    <div className="page">
      <div className="box">
        <ChatHistory chat={chat} />
        <PromptForm chat={chat} />
      </div>
    </div>
  );
};

RouterChat.displayName = 'RouterChat';
