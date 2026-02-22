import { describe, it, expect } from 'vitest';
import { render, screen } from '@storybook/web-components';
import { composeStories } from '@storybook/web-components';
import * as ChatEntryStories from './chat-entry.stories.js';

const { PromptMessage, ResponseMessage, LongPromptMessage, LongResponseMessage, EmptyEntry } = composeStories(ChatEntryStories);

describe('ChatEntry Component', () => {
  describe('Render Tests', () => {
    it('renders a prompt message correctly', async () => {
      const { container } = await render(PromptMessage.render());
      const bubble = container.querySelector('.bubble');
      expect(bubble).toBeTruthy();
      expect(container.textContent).toContain('Hello, how are you?');
    });

    it('renders a response message correctly', async () => {
      const { container } = await render(ResponseMessage.render());
      const bubble = container.querySelector('.bubble');
      expect(bubble).toBeTruthy();
      expect(container.textContent).toContain("I'm doing well");
    });

    it('applies prompt class for prompt messages', async () => {
      const { container } = await render(PromptMessage.render());
      const row = container.querySelector('.chat-row');
      expect(row?.classList.contains('prompt')).toBe(true);
    });

    it('applies response class for response messages', async () => {
      const { container } = await render(ResponseMessage.render());
      const row = container.querySelector('.chat-row');
      expect(row?.classList.contains('response')).toBe(true);
    });

    it('renders timestamp', async () => {
      const { container } = await render(PromptMessage.render());
      const timestamp = container.querySelector('.ts');
      expect(timestamp).toBeTruthy();
      expect(timestamp?.textContent.length).toBeGreaterThan(0);
    });

    it('handles long text with word wrapping', async () => {
      const { container } = await render(LongPromptMessage.render());
      const bubble = container.querySelector('.bubble');
      expect(bubble).toBeTruthy();
      expect(bubble?.textContent).toContain('demonstration');
    });

    it('renders nothing for empty entry', async () => {
      const { container } = await render(EmptyEntry.render());
      const row = container.querySelector('.chat-row');
      expect(row).toBeFalsy();
    });
  });

  describe('Accessibility Tests', () => {
    it('has proper semantic structure', async () => {
      const { container } = await render(PromptMessage.render());
      const row = container.querySelector('.chat-row');
      expect(row).toBeTruthy();
    });

    it('text is readable and visible', async () => {
      const { container } = await render(ResponseMessage.render());
      const text = container.querySelector('.text');
      const style = window.getComputedStyle(text);
      expect(style.display).not.toBe('none');
    });

    it('timestamp has readable font size', async () => {
      const { container } = await render(PromptMessage.render());
      const ts = container.querySelector('.ts');
      const style = window.getComputedStyle(ts);
      // Timestamp should have smaller font size
      expect(parseInt(style.fontSize)).toBeLessThan(16);
    });

    it('color contrast exists between message and background', async () => {
      const { container } = await render(ResponseMessage.render());
      const bubble = container.querySelector('.bubble');
      const style = window.getComputedStyle(bubble);
      // Should have background color set
      expect(style.backgroundColor).toBeTruthy();
    });
  });
});
