import {LitElement, css, html} from 'lit';
import {ChatEntry} from '@model-router/router/chat.js';
import {dummyModelAdapter} from '@model-router/router/adapters/dummyAdapter.js';

const dummyChat = [
  new ChatEntry('Hello World!', true, new Date('2026-02-22T01:05:00')),
  new ChatEntry('Why hello there. How is it going?', false, new Date('2026-02-22T01:05:15')),
  new ChatEntry('Give me a lorem ipsum.', true, new Date('2026-02-22T01:06:23')),
  new ChatEntry('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', false, new Date('2026-02-22T01:07:00')),
];

/**
 * Chat demo component
 */
export class RouterDemo extends LitElement {
  static get properties () {
    return {
      chat: {type: Array},
      inputValue: {type: String},
    };
  }

  constructor () {
    super();
    // copy initial dummy chat
    this.chat = [...dummyChat];
    this.inputValue = '';
    this._timers = [];
    this._subs = [];
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    // clear any pending timers and subscriptions
    for (const t of this._timers) clearTimeout(t);
    this._timers = [];
    for (const s of this._subs) {
      try { s.unsubscribe(); } catch (e) {}
    }
    this._subs = [];
  }

  firstUpdated () {
    // ensure scroll is at bottom on initial render
    this._scrollToBottom();
  }

  updated (changed) {
    if (changed.has('chat')) {
      // scroll to bottom when chat updates
      this.updateComplete.then(() => this._scrollToBottom());
    }
  }

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
    this.inputValue = e.target.value;
  }

  _onKeyDown (e) {
    // Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._onSubmit(e);
    }
  }

  _onSubmit (e) {
    if (e && e.preventDefault) e.preventDefault();
    const text = (this.inputValue || '').trim();
    if (!text) return;

    // Append user's message (isPrompt: true)
    const userEntry = new ChatEntry(text, true, new Date());
    this.chat = [...this.chat, userEntry];
    this.inputValue = '';

    // Ask the dummy adapter for a response. Buffer its chunks, then stream them into the UI.
    const bufferParts = [];
    const sub = dummyModelAdapter('dummy', text).subscribe({
      next: (chunk) => {
        bufferParts.push(String(chunk));
      },
      error: (err) => {
        // append an error response
        const errEntry = new ChatEntry('Error generating response', false, new Date());
        this.chat = [...this.chat, errEntry];
      },
      complete: () => {
        const full = bufferParts.join('');
        // stream the response words into a new chat entry
        this._streamResponse(full);
      },
    });

    this._subs.push(sub);
  }

  _streamResponse (fullText) {
    const words = fullText.split(/\s+/).filter(Boolean);
    const entry = new ChatEntry('', false, new Date());
    this.chat = [...this.chat, entry];
    // Update the last entry incrementally
    let acc = '';
    words.forEach((w, i) => {
      const t = setTimeout(() => {
        acc = acc ? acc + ' ' + w : w;
        const updated = new ChatEntry(acc, false, new Date());
        // Replace last entry
        const newChat = this.chat.slice(0, -1).concat(updated);
        this.chat = newChat;
      }, 40 * i);
      this._timers.push(t);
    });
    // update timestamp at end
    const finishTimeout = setTimeout(() => {
      const last = this.chat[this.chat.length - 1];
      if (last) {
        const updated = new ChatEntry(last.text, last.isPrompt, new Date());
        this.chat = this.chat.slice(0, -1).concat(updated);
      }
    }, 40 * words.length + 20);
    this._timers.push(finishTimeout);
  }

  render () {
    return html`
      <div class="page">
        <div class="box">
          <div class="chat-history" role="log">
            ${this.chat.map(item => html`
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
              .value=${this.inputValue}
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
