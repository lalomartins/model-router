import {LitElement, html, css} from 'lit';
import './chat-entry.js';

export class ChatHistory extends LitElement {
  static get properties () {
    return {
      chat: {type: Object},
    };
  }

  constructor () {
    super();
    this.chat = null;
    this._entriesSub = null;
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    if (this._entriesSub) {
      try { this._entriesSub.unsubscribe(); } catch (e) {}
      this._entriesSub = null;
    }
  }

  updated (changed) {
    if (changed.has('chat')) {
      if (this._entriesSub) {
        try { this._entriesSub.unsubscribe(); } catch (e) {}
        this._entriesSub = null;
      }
      if (this.chat && this.chat.entries$) {
        this._entriesSub = this.chat.entries$.subscribe(() => {
          this.requestUpdate();
          this.updateComplete.then(() => this._scrollToBottom());
        });
      }
    }
  }

  firstUpdated () {
    this._scrollToBottom();
  }

  _scrollToBottom () {
    const scroller = this.renderRoot.querySelector('.chat-history');
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }

  render () {
    const entries = (this?.chat?.entries$?.value || []);
    return html`
        <div class="chat-history" role="log">
            ${entries.map(item => html`
                <chat-entry .entry=${item}></chat-entry>
            `)}
        </div>
    `;
  }

  static get styles () {
    return css`
        .chat-history {
            padding: 16px;
            overflow: auto;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    `;
  }
}

window.customElements.define('chat-history', ChatHistory);
