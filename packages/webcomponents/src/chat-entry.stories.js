import { ChatEntry } from './chat-entry.js';

/** Renders an individual chat entry as a bubble.
 *
 * User input gets rendered on the right-hand side in a green bubble.
 * Responses from the model get rendered on the left-hand side in a blue bubble.
 * Both kinds get a timestamp underneath.
 * Line breaks and other whitespace are preserved.
 */
export default {
  title: 'Components/ChatEntry',
  component: 'chat-entry',
  tags: ['autodocs'],
  render: (args) => {
    const el = document.createElement('chat-entry');
    el.entry = args.entry;
    return el;
  },
  parameters: {
    docs: {
      source: { code: '<chat-entry .entry="${entry}"></chat-entry>' },
    },
  },
};

export const PromptMessage = {
  args: {
    entry: {
      text: 'Hello, how are you?',
      isPrompt: true,
      timestamp: new Date('2026-02-22T10:30:00'),
    },
  },
};

export const ResponseMessage = {
  args: {
    entry: {
      text: 'I\'m doing well, thank you for asking! How can I help you today?',
      isPrompt: false,
      timestamp: new Date('2026-02-22T10:30:15'),
    },
  },
};

export const LongPromptMessage = {
  args: {
    entry: {
      text: 'This is a much longer prompt message that will demonstrate how the component handles text wrapping and multi-line content. It should wrap nicely within the bubble.\n\nIt should also display this part separately.',
      isPrompt: true,
      timestamp: new Date('2026-02-22T10:31:00'),
    },
  },
};

export const LongResponseMessage = {
  args: {
    entry: {
      text: 'This is a comprehensive response that demonstrates how the chat entry component handles longer text content. The response appears on the left with a light blue background, and the timestamp is positioned below the message bubble. The component should handle word wrapping and maintain readability even with extended text.',
      isPrompt: false,
      timestamp: new Date('2026-02-22T10:31:30'),
    },
  },
};

export const EmptyEntry = {
  args: {
    entry: null,
  },
};
