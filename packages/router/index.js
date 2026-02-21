import {BehaviorSubject, combineLatest, of, interval} from 'rxjs';
import {
  distinctUntilChanged, map, scan, switchMap, take, zip,
} from 'rxjs/operators';
import {dummyModelAdapter} from './adapters/dummyAdapter.js';

export const prompt$ = new BehaviorSubject('');
export const mode$ = new BehaviorSubject('balanced');

const MODELS = {
  fast: 'gpt-3.5-turbo',
  balanced: 'gpt-4',
};

function selectModel (prompt, mode) {
  return MODELS[mode] || 'gpt-4-turbo';
}

// Mock adapters object
export const adapters = {
  current: { run: dummyModelAdapter },
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
