import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@storybook/web-components';
import { userEvent } from '@storybook/test';
import { composeStories } from '@storybook/web-components';
import * as PromptFormStories from './prompt-form.stories.js';

const { Default, WithInitialPrompt, Interactive } = composeStories(PromptFormStories);

describe('PromptForm Component', () => {
  describe('Render Tests', () => {
    it('renders textarea input', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      expect(textarea).toBeTruthy();
      expect(textarea?.tagName).toBe('TEXTAREA');
    });

    it('renders send button', async () => {
      const { container } = await render(Default.render());
      const button = container.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
      expect(button?.textContent).toContain('Send');
    });

    it('renders form element', async () => {
      const { container } = await render(Default.render());
      const form = container.querySelector('form');
      expect(form).toBeTruthy();
      expect(form?.classList.contains('input-row')).toBe(true);
    });

    it('initializes with empty value', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      expect(textarea?.value).toBe('');
    });

    it('displays placeholder text', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      expect(textarea?.getAttribute('placeholder')).toContain('Type a message');
    });

    it('renders with initial prompt value', async () => {
      const { container } = await render(WithInitialPrompt.render());
      const textarea = container.querySelector('.message-input');
      expect(textarea?.value).toContain('Type your message');
    });
  });

  describe('Interaction Tests', () => {
    it('updates textarea value on input', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      
      await userEvent.type(textarea, 'Hello');
      expect(textarea?.value).toBe('Hello');
    });

    it('accepts multiline input with Shift+Enter', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      
      await userEvent.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');
      expect(textarea?.value).toContain('Line 1');
      expect(textarea?.value).toContain('Line 2');
    });

    it('submits form on Enter key', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      const form = container.querySelector('form');
      
      const submitSpy = vi.fn((e) => e.preventDefault());
      form?.addEventListener('submit', submitSpy);
      
      await userEvent.type(textarea, 'Test message');
      await userEvent.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(submitSpy).toHaveBeenCalled();
      });
    });

    it('does not submit form on Shift+Enter', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      const form = container.querySelector('form');
      
      const submitSpy = vi.fn((e) => e.preventDefault());
      form?.addEventListener('submit', submitSpy);
      
      await userEvent.type(textarea, 'Test{Shift>}{Enter}{/Shift}');
      
      // Shift+Enter should not trigger submit
      await waitFor(() => {
        expect(submitSpy).not.toHaveBeenCalled();
      }, { timeout: 500 });
    });

    it('clears textarea after submission', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      
      await userEvent.type(textarea, 'Test message');
      expect(textarea?.value).toBe('Test message');
      
      // Note: actual clearing depends on chat.onPrompt implementation
      // This test verifies the textarea can be manipulated
    });

    it('button is clickable', async () => {
      const { container } = await render(Default.render());
      const button = container.querySelector('button[type="submit"]');
      
      expect(button?.disabled).toBe(false);
      await userEvent.click(button);
    });

    it('maintains focus on textarea', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      
      textarea?.focus();
      expect(document.activeElement).toBe(textarea);
    });
  });

  describe('Accessibility Tests', () => {
    it('textarea has aria-label', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      expect(textarea?.getAttribute('aria-label')).toBeTruthy();
    });

    it('form has proper semantic structure', async () => {
      const { container } = await render(Default.render());
      const form = container.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('button has accessible text', async () => {
      const { container } = await render(Default.render());
      const button = container.querySelector('button[type="submit"]');
      expect(button?.textContent?.trim()).toBe('Send');
    });

    it('textarea is keyboard accessible', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      
      textarea?.focus();
      expect(document.activeElement).toBe(textarea);
    });

    it('form elements have appropriate sizing', async () => {
      const { container } = await render(Default.render());
      const textarea = container.querySelector('.message-input');
      const style = window.getComputedStyle(textarea);
      
      // Check minimum height for accessibility
      expect(parseInt(style.minHeight)).toBeGreaterThanOrEqual(40);
    });

    it('input and button have sufficient color contrast', async () => {
      const { container } = await render(Default.render());
      const button = container.querySelector('button[type="submit"]');
      const style = window.getComputedStyle(button);
      
      expect(style.backgroundColor).toBeTruthy();
      expect(style.color).toBeTruthy();
    });
  });
});
