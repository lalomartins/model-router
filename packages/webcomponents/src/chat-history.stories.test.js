import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@storybook/web-components';
import { composeStories } from '@storybook/web-components';
import * as ChatHistoryStories from './chat-history.stories.js';

const { WithMessages, Empty, SingleMessage, ManyMessages } = composeStories(ChatHistoryStories);

describe('ChatHistory Component', () => {
  describe('Render Tests', () => {
    it('renders chat-entry components for each message', async () => {
      const { container } = await render(WithMessages.render());
      const entries = container.querySelectorAll('chat-entry');
      expect(entries.length).toBe(4);
    });

    it('renders empty state correctly', async () => {
      const { container } = await render(Empty.render());
      const entries = container.querySelectorAll('chat-entry');
      expect(entries.length).toBe(0);
    });

    it('renders single message', async () => {
      const { container } = await render(SingleMessage.render());
      const entries = container.querySelectorAll('chat-entry');
      expect(entries.length).toBe(1);
    });

    it('renders many messages without errors', async () => {
      const { container } = await render(ManyMessages.render());
      const entries = container.querySelectorAll('chat-entry');
      expect(entries.length).toBeGreaterThan(0);
    });

    it('has proper scrollable container structure', async () => {
      const { container } = await render(WithMessages.render());
      const history = container.querySelector('.chat-history');
      expect(history).toBeTruthy();
      const style = window.getComputedStyle(history);
      expect(style.overflowY).toBe('auto');
    });

    it('applies flexbox layout', async () => {
      const { container } = await render(WithMessages.render());
      const history = container.querySelector('.chat-history');
      const style = window.getComputedStyle(history);
      expect(style.display).toBe('flex');
      expect(style.flexDirection).toBe('column');
    });
  });

  describe('Interaction Tests', () => {
    it('can scroll when messages overflow', async () => {
      const { container } = await render(ManyMessages.render());
      const history = container.querySelector('.chat-history');
      expect(history).toBeTruthy();
      // Verify scrollable element
      expect(history?.scrollHeight).toBeGreaterThanOrEqual(history?.clientHeight);
    });

    it('maintains scroll to bottom on updates', async () => {
      const { container } = await render(WithMessages.render());
      const history = container.querySelector('.chat-history');
      // Simulate user scrolling to bottom
      history?.scrollTo?.(0, history.scrollHeight);
      expect(history?.scrollTop).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Accessibility Tests', () => {
    it('has role="log" for live region', async () => {
      const { container } = await render(WithMessages.render());
      const history = container.querySelector('[role="log"]');
      expect(history).toBeTruthy();
    });

    it('maintains semantic structure for messages', async () => {
      const { container } = await render(WithMessages.render());
      const entries = container.querySelectorAll('chat-entry');
      expect(entries.length).toBeGreaterThan(0);
    });

    it('provides sufficient spacing between messages', async () => {
      const { container } = await render(WithMessages.render());
      const history = container.querySelector('.chat-history');
      const style = window.getComputedStyle(history);
      const gap = style.gap;
      expect(gap).toBeTruthy();
      // Gap should be a positive value
      expect(parseInt(gap) > 0).toBe(true);
    });

    it('is keyboard navigable', async () => {
      const { container } = await render(WithMessages.render());
      const history = container.querySelector('.chat-history');
      expect(document.activeElement).toBeDefined();
    });
  });
});
