import {selectModel} from './core.js';

/*
 * A simplified version that works with globals, for very simple demos
 */

export const prompt$ = new BehaviorSubject('');
export const mode$ = new BehaviorSubject('balanced');
export const modelSelection$ = combineLatest([prompt$, mode$])
  .pipe(map(([prompt, mode]) => selectModel(prompt, mode)), distinctUntilChanged());

// returns an Observable that streams tokens (strings) and metrics objects
export function runPrompt (prompt) {
  return modelSelection$.pipe(take(1), switchMap(model => adapters.current.run(model, prompt)));
}
