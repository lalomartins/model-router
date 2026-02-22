import { ChatHistory } from './chat-history.js';
import { Chat, ChatEntry } from '@model-router/router/chat';

/** Displays a chat history as a scrollable list of chat entries.
 */
export default {
  title: 'Components/ChatHistory',
  component: 'chat-history',
  tags: ['autodocs'],
  render: (args) => {
    const el = document.createElement('chat-history');
    el.chat = args.chat;
    return el;
  },
};

const sampleEntries = [
  new ChatEntry('Hello! How can I help you today?', true, new Date('2026-02-22T09:00:00')),
  new ChatEntry('I\'d like to know about your services.', false, new Date('2026-02-22T09:00:15')),
  new ChatEntry('We offer a comprehensive suite of tools for model routing and management.', true, new Date('2026-02-22T09:00:30')),
  new ChatEntry('That sounds interesting! Can you tell me more?', false, new Date('2026-02-22T09:01:00')),
];

export const WithMessages = {
  args: {
    chat: new Chat([...sampleEntries]),
  },
};

export const Empty = {
  args: {
    chat: new Chat([]),
  },
};

export const SingleMessage = {
  args: {
    chat: new Chat([
      new ChatEntry('Hello there!', true, new Date('2026-02-22T10:00:00')),
    ]),
  },
};

export const ManyMessages = {
  args: {
    chat: new Chat([
      ...sampleEntries,
      ...sampleEntries,
      ...sampleEntries,
    ]),
  },
};
