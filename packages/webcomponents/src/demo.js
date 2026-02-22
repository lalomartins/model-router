import {LitElement, css, html} from 'lit';
import {Chat, ChatEntry} from '@model-router/router/chat.js';

const dummyChat = [
  new ChatEntry('Hello World!', true, new Date('2026-02-22T01:05:00')),
  new ChatEntry('Why hello there. How is it going?', false, new Date('2026-02-22T01:05:15')),
  new ChatEntry('Give me a lorem ipsum.', true, new Date('2026-02-22T01:06:23')),
  new ChatEntry('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', false, new Date('2026-02-22T01:07:00')),
];

/**
 * Wrap all components in a basic demo.
 */
export class RouterDemo extends LitElement {
  static get properties () {
    return {};
  }

  constructor () {
    super();
    // expose only chat instance
    this.chat = new Chat([...dummyChat]);
    this._entriesSub = null;
    this._promptSub = null;
  }

  connectedCallback () {
    super.connectedCallback();
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    if (this._entriesSub) {
      try { this._entriesSub.unsubscribe(); } catch (e) {}
      this._entriesSub = null;
    }
    if (this._promptSub) {
      try { this._promptSub.unsubscribe(); } catch (e) {}
      this._promptSub = null;
    }
  }

  firstUpdated () {
    this._scrollToBottom();
    if (this.chat && this.chat.entries$) {
      this._entriesSub = this.chat.entries$.subscribe(() => {
        // entries changed, request an update so the template reads from this.chat.entries$.value
        this.requestUpdate();
        // scroll to bottom after render
        this.updateComplete.then(() => this._scrollToBottom());
      });
    }

    if (this.chat && this.chat.prompt$) {
      this._promptSub = this.chat.prompt$.subscribe(() => {
        // prompt changed, update the textarea value by requesting an update
        this.requestUpdate();
      });
    }
  }
  // no reactive properties to track; updates are driven by BehaviorSubject subscriptions

  _scrollToBottom () {
    const scroller = this.renderRoot.querySelector('.chat-history');
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }

  _formatTimestamp (ts) {
    try {
      return ts instanceof Date ? ts.toLocaleString() : new Date(ts).toLocaleString();
    } catch (e) {
      return String(ts);
    }
  }

  _onInput (e) {
    const v = e.target.value;
    if (this.chat && this.chat.prompt$) this.chat.prompt$.next(v);
  }

  _onKeyDown (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._onSubmit(e);
    }
  }

  _onSubmit (e) {
    if (e && e.preventDefault) e.preventDefault();
    const text = ((this.chat && this.chat.prompt$ && this.chat.prompt$.value) || '').trim();
    if (!text) return;

    if (this.chat && typeof this.chat.onPrompt === 'function') {
      this.chat.onPrompt(text);
    }

    // clear prompt
    if (this.chat && this.chat.prompt$) this.chat.prompt$.next('');
  }

  render () {
    return html`
      <div class="page">
        <div class="box">
          <div class="chat-history" role="log">
            ${((this.chat && this.chat.entries$ && this.chat.entries$.value) || []).map(item => html`
              <div class="chat-row ${item.isPrompt ? 'prompt' : 'response'}">
                <div class="bubble">
                  <div class="text">${item.text}</div>
                </div>
                <div class="ts">${this._formatTimestamp(item.timestamp)}</div>
              </div>
            `)}
          </div>

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
        </div>
      </div>
    `;
  }

  static get styles () {
    return css`
        :host {
            display: block;
            width: 100%;
        }

        .page {
            min-height: 100vh;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #2f2f2f; /* dark gray outside box */
            padding: 24px;
        }

        .box {
            width: 100%;
            max-width: 800px;
            background: #e9e9e9; /* light gray inside */
            border-radius: 8px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            height: 80vh;
            overflow: hidden;
        }

        .chat-history {
            padding: 16px;
            overflow: auto;
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .chat-row {
            display: flex;
            flex-direction: column;
        }

        .chat-row.response {
            justify-content: flex-start;
        }

        .chat-row.prompt {
            justify-content: flex-end;
            align-items: flex-end;
        }

        .bubble {
            max-width: 75%;
            padding: 10px 14px;
            border-radius: 12px;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .chat-row.response .bubble {
            background: #d8ecff; /* light blue */
            color: #07233a;
            border-top-left-radius: 4px;
        }

        .chat-row.prompt .bubble {
            background: #dff7e2; /* light green */
            color: #063b14;
            border-top-right-radius: 4px;
        }

        .ts {
            font-size: 12px;
            color: #666;
            margin-top: 6px;
            max-width: 75%;
        }

        .chat-row.response .ts {
            margin-left: 0;
            text-align: left;
        }

        .chat-row.prompt .ts {
            margin-left: auto;
            text-align: right;
        }

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

window.customElements.define('router-demo', RouterDemo);
