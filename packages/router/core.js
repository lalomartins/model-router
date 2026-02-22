import {interval, of} from 'rxjs';
import {scan, zip} from 'rxjs/operators';
import {dummyModelAdapter} from './adapters/dummyAdapter.js';

const MODELS = {
  fast: 'gpt-3.5-turbo',
  balanced: 'gpt-4',
};

export function selectModel (prompt, mode) {
  return MODELS[mode] || 'gpt-4-turbo';
}

// Mock adapters object
export const adapters = {
  current: {run: dummyModelAdapter},
};

export function fakeModelStream (text, wordDelay = 45) {
  return of(text.split(' ')).pipe(zip(interval(wordDelay)), scan((acc, [word]) => acc + ' ' + word, ''));
}
