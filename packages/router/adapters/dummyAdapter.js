import {Observable} from 'rxjs';

// returns Observable that emits lorem ipsum in small chunks (simulates streaming)
export function dummyModelAdapter (modelName, prompt) {
  return new Observable(subscriber => {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const chunks = lorem.split(' ');
    let cancelled = false;

    // Emit all chunks in a microtask so tests and environments with fake timers don't
    // block completion. This still provides async behavior but doesn't depend on setTimeout.
    const scheduleMicrotask = typeof queueMicrotask === 'function'
      ? queueMicrotask
      : (fn) => Promise.resolve().then(fn);

    scheduleMicrotask(() => {
      if (cancelled) return;
      try {
        for (let i = 0; i < chunks.length; i++) {
          if (cancelled) return;
          subscriber.next(chunks[i] + (i < chunks.length - 1 ? ' ' : ''));
        }
        if (!cancelled) subscriber.complete();
      } catch (e) {
        try { subscriber.error(e); } catch (__) {}
      }
    });

    return () => {
      cancelled = true;
    };
  });
}
