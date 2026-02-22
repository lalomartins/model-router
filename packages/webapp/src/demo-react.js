import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Chat, ChatEntry as ChatEntryModel} from '@model-router/router/chat';
import {RouterChat} from '@model-router/react';

const dummyChat = [
  new ChatEntryModel('Hello World!', true, new Date('2026-02-22T01:05:00')),
  new ChatEntryModel('Why hello there. How is it going?', false, new Date('2026-02-22T01:05:15')),
  new ChatEntryModel('Give me a lorem ipsum.', true, new Date('2026-02-22T01:06:23')),
  new ChatEntryModel('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', false, new Date('2026-02-22T01:07:00')),
];

export const DemoReact = () => {
  const [chat] = useState(() => new Chat([...dummyChat]));

  return React.createElement(RouterChat, {chat});
};

DemoReact.displayName = 'RouterDemo';

const root = createRoot(document.body);
root.render(React.createElement(DemoReact));
