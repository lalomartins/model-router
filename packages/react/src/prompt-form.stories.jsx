import React from 'react';
import { PromptForm } from './PromptForm.jsx';
import { Chat } from '@model-router/router/chat';

export default {
  title: 'Components/PromptForm',
  component: PromptForm,
  tags: ['autodocs'],
};

const Template = (args) => <PromptForm {...args} />;

const defaultChat = new Chat([]);

export const Default = Template.bind({});
Default.args = { chat: defaultChat };

export const WithInitialPrompt = Template.bind({});
WithInitialPrompt.args = { chat: (() => { const c = new Chat([]); c.prompt$.next('Type your message here...'); return c; })() };

export const Interactive = Template.bind({});
Interactive.args = { chat: new Chat([]) };
