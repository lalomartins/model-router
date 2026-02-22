import {Observable} from 'rxjs';

// returns Observable that emits partial outputs
export function httpModelAdapter (modelName, prompt) {
  return new Observable(subscriber => {
    let controller;
    let abortSupported = true;

    try {
      controller = new AbortController();
    } catch (e) {
      abortSupported = false;
    }

    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({prompt}),
    };

    if (abortSupported && controller) {
      fetchOptions.signal = controller.signal;
    }

    fetch(`http://localhost:PORT/generate?model=${modelName}`, fetchOptions)
      .then(resp => {
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();

        const readChunk = () => {
          reader.read().then(({done, value}) => {
            if (done) {
              subscriber.complete();
              return;
            }

            const chunk = decoder.decode(value, {stream: true});
            subscriber.next(chunk);
            readChunk();
          }).catch(err => subscriber.error(err));
        };

        readChunk();
      })
      .catch(err => subscriber.error(err));

    return () => {
      if (abortSupported && controller) {
        controller.abort();
      }
    };
  });
}
