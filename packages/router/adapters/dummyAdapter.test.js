import {describe, it, expect, vi, afterEach} from 'vitest';
import {dummyModelAdapter} from './dummyAdapter.js';

describe('dummyModelAdapter', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should return an Observable', () => {
    const result = dummyModelAdapter(10)('any-model', 'prompt');
    expect(result).toBeDefined();
    expect(result.subscribe).toBeDefined();
  });

  it('should emit at least one chunk and then complete', async () => {
    const chunks = [];

    const adapter = dummyModelAdapter(10)('m', 'p');

    // Wait for completion via a promise so tests aren't dependent on arbitrary timeouts
    const done = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Adapter did not complete in time')), 1000);

      adapter.subscribe({
        next: (c) => chunks.push(c),
        error: (e) => {
          clearTimeout(timeout);
          reject(e);
        },
        complete: () => {
          clearTimeout(timeout);
          resolve();
        },
      });
    });

    await done;

    expect(chunks.length).toBeGreaterThan(0);
  });

  it('should support unsubscribe without throwing', async () => {
    const errorHandler = vi.fn();

    const adapter = dummyModelAdapter(10)('m', 'p');
    const subscription = adapter.subscribe({
      next: () => {},
      error: errorHandler,
      complete: () => {},
    });

    // unsubscribe quickly
    await new Promise(resolve => setTimeout(resolve, 20));
    subscription.unsubscribe();

    // give a moment to ensure no errors bubbled up
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(errorHandler).not.toHaveBeenCalled();
  });
});
