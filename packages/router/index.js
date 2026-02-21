import {BehaviorSubject, combineLatest, of, interval} from 'rxjs';
import {
  distinctUntilChanged, map, scan, switchMap, take, zip,
} from 'rxjs/operators';

export const prompt$ = new BehaviorSubject('');
export const mode$ = new BehaviorSubject('balanced');

// Simple model selection logic
function selectModel (prompt, mode) {
  // Basic implementation - can be extended
  if (mode === 'fast') return 'gpt-3.5-turbo';
  if (mode === 'balanced') return 'gpt-4';
  return 'gpt-4-turbo';
}

// Mock adapters object
export const adapters = {
  current: null,
};

export const modelSelection$ = combineLatest([prompt$, mode$])
  .pipe(map(([prompt, mode]) => selectModel(prompt, mode)), distinctUntilChanged());

// returns an Observable that streams tokens (strings) and metrics objects
export function runPrompt (prompt) {
  return modelSelection$.pipe(take(1), switchMap(model => adapters.current.run(model, prompt)));
}

export function fakeModelStream (text, wordDelay = 45) {
  return of(text.split(' ')).pipe(zip(interval(wordDelay)), scan((acc, [word]) => acc + ' ' + word, ''));
}
