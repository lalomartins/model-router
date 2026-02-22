import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './chat-history.stories.jsx';

const { WithMessages, Empty, SingleMessage, ManyMessages } = composeStories(stories);

describe('ChatHistory (React)', () => {
  it('renders chat entries for each message', () => {
    const { container } = render(<WithMessages />);
    expect(container.querySelectorAll('.chat-row').length).toBeGreaterThan(0);
  });

  it('renders empty state', () => {
    const { container } = render(<Empty />);
    expect(container.querySelectorAll('.chat-row').length).toBe(0);
  });

  it('scrollable container exists', () => {
    const { container } = render(<WithMessages />);
    const history = container.querySelector('.chat-history');
    expect(history).toBeTruthy();
  });
});
