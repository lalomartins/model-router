import {LitElement, html, css} from 'lit';

export class PromptForm extends LitElement {
  static get properties() {
    return {
      chat: {type: Object},
    };
  }

  constructor() {
    super();
    this.chat = null;
    this._promptSub = null;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._promptSub) {
      try { this._promptSub.unsubscribe(); } catch (e) {}
      this._promptSub = null;
    }
  }

  updated(changed) {
    if (changed.has('chat')) {
      if (this._promptSub) {
        try { this._promptSub.unsubscribe(); } catch (e) {}
        this._promptSub = null;
      }
      if (this.chat && this.chat.prompt$) {
        this._promptSub = this.chat.prompt$.subscribe(() => this.requestUpdate());
      }
    }
  }

  _onInput(e) {
    const v = e.target.value;
    if (this.chat && this.chat.prompt$) this.chat.prompt$.next(v);
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._onSubmit(e);
    }
  }

  _onSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const text = ((this.chat && this.chat.prompt$ && this.chat.prompt$.value) || '').trim();
    if (!text) return;

    if (this.chat && typeof this.chat.onPrompt === 'function') {
      this.chat.onPrompt(text);
    }

    if (this.chat && this.chat.prompt$) this.chat.prompt$.next('');
    // keep focus on textarea
    this.updateComplete.then(() => {
      const ta = this.renderRoot.querySelector('.message-input');
      if (ta) ta.focus();
    });
  }

  render() {
    return html`
      <form class="input-row" @submit=${this._onSubmit}>
        <textarea
          class="message-input"
          .value=${(this.chat && this.chat.prompt$ && this.chat.prompt$.value) || ''}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
          placeholder="Type a message... (Shift+Enter for newline)"
          aria-label="Type a message"
          rows="2"
        ></textarea>
        <button type="submit">Send</button>
      </form>
    `;
  }

  static get styles() {
    return css`
      .input-row {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(0, 0, 0, 0.02);
      }

      .message-input {
          flex: 1 1 auto;
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
          resize: vertical;
          min-height: 40px;
          max-height: 160px;
      }

      button[type="submit"] {
          padding: 8px 12px;
          border-radius: 6px;
          border: none;
          background: #1976d2;
          color: white;
          cursor: pointer;
      }

      button[type="submit"]:hover {
          opacity: 0.95;
      }
    `;
  }
}

window.customElements.define('prompt-form', PromptForm);
