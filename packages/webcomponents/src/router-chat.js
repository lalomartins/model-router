import {css, html, LitElement} from 'lit';
import './chat-history.js';
import './prompt-form.js';

export class RouterChat extends LitElement {
  static get properties() {
    return {
      chat: {type: Object},
    };
  }

  constructor() {
    super();
    this.chat = null;
  }

  render() {
    return html`
      <div class="page">
        <div class="box">
          <chat-history .chat=${this.chat}></chat-history>
          <prompt-form .chat=${this.chat}></prompt-form>
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

        chat-history {
            flex: 1 1 auto;
            overflow: hidden;
        }
    `;
  }
}

window.customElements.define('router-chat', RouterChat);
