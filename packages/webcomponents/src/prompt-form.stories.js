import { PromptForm } from './prompt-form.js';
import { Chat } from '@model-router/router/chat';

/** Allows the user to send a prompt to the model.
 *
 * The message is sent to the model when the user presses Enter or clicks the Send button.
 * Shift-Enter can be used to insert a line break instead.
 */
export default {
  title: 'Components/PromptForm',
  component: 'prompt-form',
  tags: ['autodocs'],
  render: (args) => {
    const el = document.createElement('prompt-form');
    el.chat = args.chat;
    return el;
  },
  parameters: {
    docs: {
      source: { code: '<prompt-form .chat="${chat}"></prompt-form>' },
    },
  },
};

const defaultChat = new Chat([]);

export const Default = {
  args: {
    chat: defaultChat,
  },
};

export const WithInitialPrompt = {
  args: {
    chat: (() => {
      const chat = new Chat([]);
      chat.prompt$.next('Type your message here...');
      return chat;
    })(),
  },
};
