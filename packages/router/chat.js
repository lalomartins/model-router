import {BehaviorSubject, combineLatest} from 'rxjs';
import {distinctUntilChanged, map, switchMap, take} from 'rxjs/operators';
import {adapters, selectModel} from './core.js';

class ChatEntry {
  constructor (text, isPrompt, timestamp) {
    this.text = text;
    this.isPrompt = isPrompt;
    this.timestamp = timestamp;
  }
}

class Chat {
  constructor (entries) {
    this.entries$ = new BehaviorSubject(entries || []);
    this.prompt$ = new BehaviorSubject('');
    this.mode$ = new BehaviorSubject('balanced');
    this.busy$ = new BehaviorSubject(false);

    // Use this instance's prompt$ and mode$ so the Chat instance is self-contained
    this.modelSelection$ = combineLatest([this.prompt$, this.mode$])
      .pipe(map(([prompt, mode]) => selectModel(prompt, mode)), distinctUntilChanged());
  }

  addPrompt (text) {
    this.entries$.next([...this.entries$.value, new ChatEntry(text, true, new Date())]);
  }

  addResponse (text, timestamp) {
    this.entries$.next([...this.entries$.value, new ChatEntry(text, false, timestamp || new Date())]);
  }

  // returns an Observable that streams tokens (strings) and metrics objects
  runPrompt (prompt) {
    return this.modelSelection$.pipe(take(1), switchMap(model => adapters.current.run(model, prompt)));
  }

  onPrompt (text) {
    this.addPrompt(text);
    this.busy$.next(true);
    const index = this.entries$.value.length;
    this.addResponse('…');
    this.runPrompt(text).subscribe({
      next: (chunk) => {
        const entries = [...this.entries$.value];
        // update the response entry at index by appending the chunk; responses are not prompts
        entries[index] = new ChatEntry(entries[index].text + chunk, false, entries[index].timestamp);
        this.entries$.next(entries);
      },
      complete: () => {
        const entries = [...this.entries$.value];
        // finalize response timestamp; keep isPrompt false
        entries[index] = new ChatEntry(entries[index].text, false, new Date());
        this.entries$.next(entries);
        this.busy$.next(false);
      },
    });
  }
}

export {Chat, ChatEntry};
