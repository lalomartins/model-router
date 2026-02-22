import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './router-chat.stories.jsx';

const { Default, Empty } = composeStories(stories);

describe('RouterChat (React)', () => {
  it('renders page and box', () => {
    const { container } = render(<Default />);
    expect(container.querySelector('.page')).toBeTruthy();
    expect(container.querySelector('.box')).toBeTruthy();
  });

  it('renders child components', () => {
    const { container } = render(<Default />);
    expect(container.querySelector('.chat-history')).toBeTruthy();
    expect(container.querySelector('.input-row')).toBeTruthy();
  });

  it('empty chat shows no entries', () => {
    const { container } = render(<Empty />);
    expect(container.querySelectorAll('.chat-row').length).toBe(0);
  });
});
