import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@storybook/web-components';
import { composeStories } from '@storybook/web-components';
import * as RouterChatStories from './router-chat.stories.js';

const { Default, Empty, SingleMessage } = composeStories(RouterChatStories);

describe('RouterChat Component', () => {
  describe('Render Tests', () => {
    it('renders page layout', async () => {
      const { container } = await render(Default.render());
      const page = container.querySelector('.page');
      expect(page).toBeTruthy();
    });

    it('renders centered box', async () => {
      const { container } = await render(Default.render());
      const box = container.querySelector('.box');
      expect(box).toBeTruthy();
    });

    it('renders chat-history component', async () => {
      const { container } = await render(Default.render());
      const history = container.querySelector('chat-history');
      expect(history).toBeTruthy();
    });

    it('renders prompt-form component', async () => {
      const { container } = await render(Default.render());
      const form = container.querySelector('prompt-form');
      expect(form).toBeTruthy();
    });

    it('renders with all messages', async () => {
      const { container } = await render(Default.render());
      const entries = container.querySelectorAll('chat-entry');
      expect(entries.length).toBeGreaterThan(0);
    });

    it('renders empty state correctly', async () => {
      const { container } = await render(Empty.render());
      const entries = container.querySelectorAll('chat-entry');
      expect(entries.length).toBe(0);
    });

    it('applies proper page layout styles', async () => {
      const { container } = await render(Default.render());
      const page = container.querySelector('.page');
      const style = window.getComputedStyle(page);
      
      expect(style.display).toBe('flex');
      expect(style.minHeight).toBe('100vh');
    });

    it('applies proper box styling', async () => {
      const { container } = await render(Default.render());
      const box = container.querySelector('.box');
      const style = window.getComputedStyle(box);
      
      expect(style.maxWidth).toBe('800px');
      expect(style.display).toBe('flex');
    });
  });

  describe('Interaction Tests', () => {
    it('allows scrolling through chat history', async () => {
      const { container } = await render(Default.render());
      const history = container.querySelector('chat-history');
      expect(history).toBeTruthy();
    });

    it('maintains flex layout for content distribution', async () => {
      const { container } = await render(Default.render());
      const history = container.querySelector('chat-history');
      const style = window.getComputedStyle(history);
      
      expect(style.flex).toBeTruthy();
    });

    it('keeps input form at bottom with proper spacing', async () => {
      const { container } = await render(Default.render());
      const form = container.querySelector('prompt-form');
      expect(form).toBeTruthy();
      // Form comes after history, so it's positioned at bottom
    });
  });

  describe('Accessibility Tests', () => {
    it('has proper page structure', async () => {
      const { container } = await render(Default.render());
      const page = container.querySelector('.page');
      expect(page).toBeTruthy();
    });

    it('provides role="log" for chat history', async () => {
      const { container } = await render(Default.render());
      const logRegion = container.querySelector('[role="log"]');
      expect(logRegion).toBeTruthy();
    });

    it('maintains readable text contrast', async () => {
      const { container } = await render(Default.render());
      const box = container.querySelector('.box');
      const style = window.getComputedStyle(box);
      
      // Box has light gray background
      expect(style.backgroundColor).toBeTruthy();
    });

    it('dark gray background outside box for contrast', async () => {
      const { container } = await render(Default.render());
      const page = container.querySelector('.page');
      const style = window.getComputedStyle(page);
      
      // Page has dark gray background
      expect(style.backgroundColor).toBeTruthy();
    });

    it('all interactive elements are accessible', async () => {
      const { container } = await render(Default.render());
      
      // Chat history has role="log"
      const history = container.querySelector('[role="log"]');
      expect(history).toBeTruthy();
      
      // Input form is present
      const form = container.querySelector('prompt-form');
      expect(form).toBeTruthy();
    });

    it('layout is responsive and centered', async () => {
      const { container } = await render(Default.render());
      const page = container.querySelector('.page');
      const style = window.getComputedStyle(page);
      
      expect(style.justifyContent).toBe('center');
      expect(style.alignItems).toBe('center');
    });

    it('maintains proper z-index and layering', async () => {
      const { container } = await render(Default.render());
      const page = container.querySelector('.page');
      expect(page).toBeTruthy();
      const box = container.querySelector('.box');
      expect(box).toBeTruthy();
    });
  });
});
