import {describe, it, expect} from 'vitest';
import {selectModel, adapters} from './core.js';

describe('core module', () => {
  describe('selectModel', () => {
    it('selects gpt-3.5-turbo for fast mode', () => {
      expect(selectModel('anything', 'fast')).toBe('gpt-3.5-turbo');
    });

    it('selects gpt-4 for balanced mode', () => {
      expect(selectModel('anything', 'balanced')).toBe('gpt-4');
    });

    it('defaults to gpt-4-turbo for unknown mode', () => {
      expect(selectModel('anything', 'quality')).toBe('gpt-4-turbo');
    });
  });

  describe('adapters object', () => {
    it('allows setting adapters.current', () => {
      const mockAdapter = {run: () => {}};
      adapters.current = mockAdapter;
      expect(adapters.current).toBe(mockAdapter);
      adapters.current = null;
    });
  });
});
