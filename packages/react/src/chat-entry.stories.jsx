import React from 'react';
import { ChatEntry } from './ChatEntry.jsx';

export default {
  title: 'Components/ChatEntry',
  component: ChatEntry,
  tags: ['autodocs'],
};

const Template = (args) => <ChatEntry {...args} />;

export const PromptMessage = Template.bind({});
PromptMessage.args = {
  entry: {
    text: 'Hello, how are you?',
    isPrompt: true,
    timestamp: new Date('2026-02-22T10:30:00'),
  },
};

export const ResponseMessage = Template.bind({});
ResponseMessage.args = {
  entry: {
    text: "I'm doing well, thank you for asking! How can I help you today?",
    isPrompt: false,
    timestamp: new Date('2026-02-22T10:30:15'),
  },
};

export const LongPromptMessage = Template.bind({});
LongPromptMessage.args = {
  entry: {
    text: 'This is a much longer prompt message that will demonstrate how the component handles text wrapping and multi-line content. It should wrap nicely within the bubble.\n\nIt should also display this part separately.',
    isPrompt: true,
    timestamp: new Date('2026-02-22T10:31:00'),
  },
};

export const LongResponseMessage = Template.bind({});
LongResponseMessage.args = {
  entry: {
    text: 'This is a comprehensive response that demonstrates how the chat entry component handles longer text content. The response appears on the left with a light blue background, and the timestamp is positioned below the message bubble. The component should handle word wrapping and maintain readability even with extended text.',
    isPrompt: false,
    timestamp: new Date('2026-02-22T10:31:30'),
  },
};

export const EmptyEntry = Template.bind({});
EmptyEntry.args = { entry: null };
