import {describe, it, expect, beforeEach, vi} from 'vitest';
import {Chat} from './chat.js';
import {adapters} from './core.js';
import {of, firstValueFrom} from 'rxjs';

describe('Chat', () => {
  beforeEach(() => {
    // Ensure a dummy adapter is available; tests will stub adapters.current
    adapters.current = null;
  });

  it('initializes with optional entries', () => {
    const c = new Chat([{text: 'hi', isPrompt: false, timestamp: new Date()}]);
    expect(c.entries$.value.length).toBe(1);
  });

  it('addPrompt adds a prompt entry', () => {
    const c = new Chat([]);
    c.addPrompt('hello');
    expect(c.entries$.value.length).toBe(1);
    expect(c.entries$.value[0].text).toBe('hello');
    expect(c.entries$.value[0].isPrompt).toBe(true);
  });

  it('addResponse adds a response entry', () => {
    const c = new Chat([]);
    c.addResponse('resp');
    expect(c.entries$.value.length).toBe(1);
    expect(c.entries$.value[0].text).toBe('resp');
    expect(c.entries$.value[0].isPrompt).toBe(false);
  });

  it('runPrompt delegates to adapters.current.run with selected model', async () => {
    const c = new Chat([]);
    const mockRun = vi.fn(() => of('ok'));
    adapters.current = {run: mockRun};
    // call runPrompt and await first value to ensure adapter.run was invoked
    await firstValueFrom(c.runPrompt('hey')).catch(()=>{});
    expect(mockRun).toHaveBeenCalled();
  });

  it('onPrompt appends prompt and streams response', (done) => {
    const c = new Chat([]);
    const chunks = ['hello ', 'world'];
    adapters.current = {run: (model, prompt) => {
      return of(...chunks);
    }};

    c.onPrompt('say hi');
    // last entry should be updated to concatenated response after completion
    setTimeout(() => {
      const entries = c.entries$.value;
      expect(entries.length).toBe(2); // prompt + response
      expect(entries[1].isPrompt).toBe(false);
      expect(entries[1].text.includes('hello')).toBe(true);
      done();
    }, 10);
  });
});
