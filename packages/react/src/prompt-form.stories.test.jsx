import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './prompt-form.stories.jsx';

const { Default, WithInitialPrompt } = composeStories(stories);

describe('PromptForm (React)', () => {
  it('renders textarea and send button', () => {
    render(<Default />);
    expect(screen.getByPlaceholderText(/Type a message/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('initial prompt value is displayed', () => {
    render(<WithInitialPrompt />);
    expect(screen.getByDisplayValue(/Type your message here/)).toBeInTheDocument();
  });

  it('updates value on typing', () => {
    render(<Default />);
    const textarea = screen.getByPlaceholderText(/Type a message/);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(textarea.value).toBe('Hello');
  });
});
