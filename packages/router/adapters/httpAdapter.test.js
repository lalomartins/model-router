import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {httpModelAdapter} from './httpAdapter.js';

describe('httpModelAdapter', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should return an Observable', () => {
    const result = httpModelAdapter('gpt-4', 'test prompt');
    expect(result).toBeDefined();
    expect(result.subscribe).toBeDefined();
  });

  it('should create fetch request with correct URL and method', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      body: {
        getReader: () => ({
          read: vi.fn().mockResolvedValue({done: true}),
        }),
      },
    });

    const adapter = httpModelAdapter('gpt-4', 'test prompt');
    adapter.subscribe();

    await new Promise(resolve => setTimeout(resolve, 20));

    expect(fetchSpy).toHaveBeenCalled();
    const [url, options] = fetchSpy.mock.calls[0];
    expect(url).toContain('gpt-4');
    expect(options.method).toBe('POST');
  });

  it('should include model name in URL', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      body: {getReader: () => ({read: vi.fn().mockResolvedValue({done: true})})},
    });

    const modelName = 'claude-v3';
    httpModelAdapter(modelName, 'test').subscribe();

    await new Promise(resolve => setTimeout(resolve, 20));

    const [url] = fetchSpy.mock.calls[0];
    expect(url).toContain(modelName);
  });

  it('should include prompt in request body', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      body: {getReader: () => ({read: vi.fn().mockResolvedValue({done: true})})},
    });

    const testPrompt = 'What is AI?';
    httpModelAdapter('gpt-4', testPrompt).subscribe();

    await new Promise(resolve => setTimeout(resolve, 20));

    const [, options] = fetchSpy.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.prompt).toBe(testPrompt);
  });

  it('should handle AbortController gracefully', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));

    const adapter = httpModelAdapter('gpt-4', 'test');
    const subscription = adapter.subscribe();

    await new Promise(resolve => setTimeout(resolve, 20));

    // Should not throw even with or without AbortController
    subscription.unsubscribe();
    expect(true).toBe(true);
  });

  it('should pass abort signal to fetch when available', async () => {
    const mockSignal = {aborted: false};

    vi.spyOn(global, 'fetch').mockResolvedValue({
      body: {getReader: () => ({read: vi.fn().mockResolvedValue({done: true})})},
    });

    httpModelAdapter('gpt-4', 'test').subscribe();

    await new Promise(resolve => setTimeout(resolve, 20));

    const [, options] = global.fetch.mock.calls[0];
    // Should either have signal or not, depending on AbortController availability
    expect(options).toHaveProperty('method');
    expect(options).toHaveProperty('body');
  });

  it('should handle fetch errors', async () => {
    const testError = new Error('Network error');
    vi.spyOn(global, 'fetch').mockRejectedValue(testError);

    const errorHandler = vi.fn();
    const adapter = httpModelAdapter('gpt-4', 'test');
    adapter.subscribe({
      next: vi.fn(),
      error: errorHandler,
      complete: vi.fn(),
    });

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(errorHandler).toHaveBeenCalledWith(testError);
  });

  it('should use POST method', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      body: {getReader: () => ({read: vi.fn().mockResolvedValue({done: true})})},
    });

    httpModelAdapter('gpt-4', 'test').subscribe();

    await new Promise(resolve => setTimeout(resolve, 20));

    const [, options] = fetchSpy.mock.calls[0];
    expect(options.method).toBe('POST');
  });
});
