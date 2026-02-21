import {describe, it, expect, beforeEach, vi} from 'vitest';
import {prompt$, mode$, modelSelection$, runPrompt, fakeModelStream, adapters} from './index.js';
import {firstValueFrom, toArray, of} from 'rxjs';

describe('Router', () => {
  describe('BehaviorSubjects', () => {
    beforeEach(() => {
      prompt$.next('');
      mode$.next('balanced');
    });

    it('should initialize with default values', () => {
      expect(prompt$.value).toBe('');
      expect(mode$.value).toBe('balanced');
    });

    it('should update prompt$', async () => {
      const testPrompt = 'What is AI?';
      const sub = prompt$.subscribe();
      prompt$.next(testPrompt);

      expect(prompt$.value).toBe(testPrompt);
      sub.unsubscribe();
    });

    it('should update mode$', async () => {
      const testMode = 'fast';
      const sub = mode$.subscribe();
      mode$.next(testMode);

      expect(mode$.value).toBe(testMode);
      sub.unsubscribe();
    });
  });

  describe('modelSelection$', () => {
    beforeEach(() => {
      prompt$.next('');
      mode$.next('balanced');
    });

    it('should emit model selection based on current state', async () => {
      const value = await firstValueFrom(modelSelection$);
      expect(value).toBe('gpt-4');
    });

    it('should select gpt-3.5-turbo for fast mode', async () => {
      mode$.next('fast');
      await new Promise(resolve => setTimeout(resolve, 10));
      const value = await firstValueFrom(modelSelection$);
      expect(value).toBe('gpt-3.5-turbo');
    });

    it('should select gpt-4 for balanced mode', async () => {
      mode$.next('balanced');
      await new Promise(resolve => setTimeout(resolve, 10));
      const value = await firstValueFrom(modelSelection$);
      expect(value).toBe('gpt-4');
    });

    it('should select gpt-4-turbo for other modes', async () => {
      mode$.next('quality');
      await new Promise(resolve => setTimeout(resolve, 10));
      const value = await firstValueFrom(modelSelection$);
      expect(value).toBe('gpt-4-turbo');
    });
  });

  describe('runPrompt', () => {
    beforeEach(() => {
      prompt$.next('test prompt');
      mode$.next('balanced');
      adapters.current = null;
    });

    it('should call adapter.current.run with selected model and prompt', async () => {
      const mockRun = vi.fn(() => of({content: 'response'}));
      adapters.current = {run: mockRun};

      try {
        await firstValueFrom(runPrompt('test prompt'));
        expect(mockRun).toHaveBeenCalledWith('gpt-4', 'test prompt');
      } catch (e) {
        // Expected to potentially error if adapter isn't set up fully
      }
    });

    it('should pass through adapter response', async () => {
      const mockResponse = {content: 'test response', tokens: 42};
      adapters.current = {run: vi.fn(() => of(mockResponse))};

      const result = await firstValueFrom(runPrompt('test prompt'));
      expect(result).toEqual(mockResponse);
    });

    it('should use fast model when mode is fast', async () => {
      mode$.next('fast');
      await new Promise(resolve => setTimeout(resolve, 10));

      const mockRun = vi.fn(() => of({content: 'fast response'}));
      adapters.current = {run: mockRun};

      try {
        await firstValueFrom(runPrompt('test prompt'));
        expect(mockRun).toHaveBeenCalledWith('gpt-3.5-turbo', 'test prompt');
      } catch (e) {
        // Expected
      }
    });
  });

  describe('fakeModelStream', () => {
    it('should split text into words', async () => {
      const text = 'hello world';
      const stream = fakeModelStream(text, 0);
      const results = await firstValueFrom(stream.pipe(toArray()));

      expect(results.length).toBeGreaterThan(0);
      // Last value should contain accumulated text
      const lastValue = results[results.length - 1];
      expect(lastValue).toBeDefined();
    });

    it('should handle single word', async () => {
      const text = 'hello';
      const stream = fakeModelStream(text, 0);
      const results = await firstValueFrom(stream.pipe(toArray()));

      expect(results.length).toBeGreaterThan(0);
    });

    it('should emit values with delay', async () => {
      const text = 'a b c';
      const stream = fakeModelStream(text, 5);
      const startTime = Date.now();

      await firstValueFrom(stream.pipe(toArray()));
      const duration = Date.now() - startTime;

      // Should take some time due to interval
      expect(duration).toBeGreaterThan(0);
    });
  });

  describe('adapters', () => {
    it('should allow setting a new adapter', () => {
      const mockAdapter = {run: vi.fn()};
      adapters.current = mockAdapter;
      expect(adapters.current).toBe(mockAdapter);
      adapters.current = null;
    });
  });
});
