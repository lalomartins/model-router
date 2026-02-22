import {describe, it, expect, beforeEach, vi} from 'vitest';
import {prompt$, mode$, modelSelection$, runPrompt} from './global.js';
import {adapters} from './core.js';
import {of, firstValueFrom} from 'rxjs';

describe('global module', () => {
  beforeEach(() => {
    prompt$.next('');
    mode$.next('balanced');
    adapters.current = null;
  });

  it('initializes with default BehaviorSubject values', () => {
    expect(prompt$.value).toBe('');
    expect(mode$.value).toBe('balanced');
  });

  it('modelSelection emits expected model for balanced', async () => {
    const value = await firstValueFrom(modelSelection$);
    expect(value).toBe('gpt-4');
  });

  it('runPrompt delegates to adapter', async () => {
    const mockRun = vi.fn(() => of({content: 'ok'}));
    adapters.current = {run: mockRun};
    await firstValueFrom(runPrompt('hello')).catch(()=>{});
    expect(mockRun).toHaveBeenCalled();
  });
});
