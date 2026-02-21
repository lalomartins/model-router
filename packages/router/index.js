import { BehaviorSubject, combineLatest, timer, from } from 'rxjs';
import { switchMap, map, scan } from 'rxjs/operators';

export const prompt$ = new BehaviorSubject('');
export const mode$ = new BehaviorSubject('balanced');

function fakeStream(prompt) {
    const text = `Echoing: ${prompt} with reactive streaming.`;
    return timer(300).pipe(
        switchMap(() =>
            from(text.split(' ')).pipe(
                scan((acc, word) => acc + ' ' + word, '')
            )
        )
    );
}

export const response$ = combineLatest([prompt$, mode$]).pipe(
    switchMap(([prompt]) => {
        if (!prompt) return from(['']);
        return fakeStream(prompt);
    })
);