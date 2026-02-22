import {LitElement, css, html} from 'lit';
import {Chat, ChatEntry} from '@model-router/router/chat.js';
import './prompt-form.js';
import './chat-history.js';

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
  }

  firstUpdated () {
  }

  render () {
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

window.customElements.define('router-demo', RouterDemo);
