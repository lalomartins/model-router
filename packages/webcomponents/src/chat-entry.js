import {LitElement, html, css} from 'lit';

export class ChatEntry extends LitElement {
  static get properties () {
    return {
      entry: {type: Object},
    };
  }

  constructor () {
    super();
    this.entry = null;
  }

  _formatTimestamp (ts) {
    try {
      return ts instanceof Date ? ts.toLocaleString() : new Date(ts).toLocaleString();
    } catch (e) {
      return String(ts);
    }
  }

  render () {
    if (!this.entry) return html``;

    return html`
        <div class="chat-row ${this.entry.isPrompt ? 'prompt' : 'response'}">
            <div class="bubble">
                <div class="text">${this.entry.text}</div>
            </div>
            <div class="ts">${this._formatTimestamp(this.entry.timestamp)}</div>
        </div>
    `;
  }

  static get styles () {
    return css`
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
    `;
  }
}

window.customElements.define('chat-entry', ChatEntry);
