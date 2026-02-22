import { RouterChat } from './router-chat.js';
import { Chat, ChatEntry } from '@model-router/router/chat';

/** Wraps chat history and prompt form in a simple layout.
 */
export default {
  title: 'Components/RouterChat',
  component: 'router-chat',
  tags: ['autodocs'],
  render: (args) => {
    const el = document.createElement('router-chat');
    el.chat = args.chat;
    return el;
  },
};

const sampleEntries = [
  new ChatEntry('Hello! Welcome to the chat interface.', true, new Date('2026-02-22T09:00:00')),
  new ChatEntry('Thanks! This looks great.', false, new Date('2026-02-22T09:00:15')),
  new ChatEntry('What would you like to know?', true, new Date('2026-02-22T09:00:30')),
  new ChatEntry('Tell me about your features.', false, new Date('2026-02-22T09:01:00')),
  new ChatEntry('We offer real-time model routing, adaptive responses, and a beautiful chat interface built with Web Components and Lit.', true, new Date('2026-02-22T09:01:30')),
];

export const Default = {
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
      new ChatEntry('Hello!', true, new Date('2026-02-22T10:00:00')),
    ]),
  },
};
