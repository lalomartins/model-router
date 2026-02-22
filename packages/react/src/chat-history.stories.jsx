import React from 'react';
import { ChatHistory } from './ChatHistory.jsx';
import { Chat, ChatEntry } from '@model-router/router/chat';

export default {
  title: 'Components/ChatHistory',
  component: ChatHistory,
  tags: ['autodocs'],
};

const Template = (args) => <ChatHistory {...args} />;

const sampleEntries = [
  new ChatEntry('Hello! How can I help you today?', true, new Date('2026-02-22T09:00:00')),
  new ChatEntry("I'd like to know about your services.", false, new Date('2026-02-22T09:00:15')),
  new ChatEntry('We offer a comprehensive suite of tools for model routing and management.', true, new Date('2026-02-22T09:00:30')),
  new ChatEntry('That sounds interesting! Can you tell me more?', false, new Date('2026-02-22T09:01:00')),
];

export const WithMessages = Template.bind({});
WithMessages.args = { chat: new Chat([...sampleEntries]) };

export const Empty = Template.bind({});
Empty.args = { chat: new Chat([]) };

export const SingleMessage = Template.bind({});
SingleMessage.args = { chat: new Chat([ new ChatEntry('Hello there!', true, new Date('2026-02-22T10:00:00')) ]) };

export const ManyMessages = Template.bind({});
ManyMessages.args = { chat: new Chat([ ...sampleEntries, ...sampleEntries, ...sampleEntries ]) };
