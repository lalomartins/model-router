class ObserveDirective extends AsyncDirective {
  constructor () {super();
    this.observable = null;
    this.#sub = null;
  }

  render (observable) {
    if (this.observable !== observable) {
      this.#sub?.unsubscribe();
      this.observable = observable;
      if (this.isConnected) {
        this.subscribe(observable);
      }
    }
    return noChange;
  }

  subscribe (observable) {
    this.#sub = observable.subscribe((v) => {
      this.setValue(v);
    });
  }

  disconnected () {
    this.#sub?.unsubscribe();
  }

  reconnected () {
    this.subscribe(this.observable);
  }
}

export const observe = directive(ObserveDirective);
