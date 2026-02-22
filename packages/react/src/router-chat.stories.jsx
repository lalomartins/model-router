import React from 'react';
import { RouterChat } from './RouterChat.jsx';
import { Chat, ChatEntry } from '@model-router/router/chat';

export default {
  title: 'Components/RouterChat',
  component: RouterChat,
  tags: ['autodocs'],
};

const Template = (args) => <RouterChat {...args} />;

const sampleEntries = [
  new ChatEntry('Hello! Welcome to the chat interface.', true, new Date('2026-02-22T09:00:00')),
  new ChatEntry('Thanks! This looks great.', false, new Date('2026-02-22T09:00:15')),
  new ChatEntry('What would you like to know?', true, new Date('2026-02-22T09:00:30')),
  new ChatEntry('Tell me about your features.', false, new Date('2026-02-22T09:01:00')),
  new ChatEntry('We offer real-time model routing, adaptive responses, and a beautiful chat interface built with Web Components and Lit.', true, new Date('2026-02-22T09:01:30')),
];

export const Default = Template.bind({});
Default.args = { chat: new Chat([...sampleEntries]) };

export const Empty = Template.bind({});
Empty.args = { chat: new Chat([]) };

export const SingleMessage = Template.bind({});
SingleMessage.args = { chat: new Chat([ new ChatEntry('Hello!', true, new Date('2026-02-22T10:00:00')) ]) };
