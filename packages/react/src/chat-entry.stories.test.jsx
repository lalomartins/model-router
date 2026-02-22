import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './chat-entry.stories.jsx';

const { PromptMessage, ResponseMessage, LongPromptMessage, LongResponseMessage, EmptyEntry } = composeStories(stories);

describe('ChatEntry (React) - Render & Accessibility', () => {
  it('renders a prompt message', () => {
    render(<PromptMessage />);
    expect(screen.getByText(/Hello, how are you\?/i)).toBeInTheDocument();
  });

  it('renders a response message', () => {
    render(<ResponseMessage />);
    expect(screen.getByText(/I\'m doing well/i)).toBeInTheDocument();
  });

  it('handles empty entry', () => {
    const { container } = render(<EmptyEntry />);
    expect(container.firstChild).toBeNull();
  });
});
