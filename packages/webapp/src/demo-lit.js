import {css, LitElement, html} from 'lit';
import {Chat, ChatEntry} from '@model-router/router/chat';
import '@model-router/webcomponents';

const dummyChat = [new ChatEntry('Hello World!', true, new Date('2026-02-22T01:05:00')), new ChatEntry('Why hello there. How is it going?', false, new Date('2026-02-22T01:05:15')), new ChatEntry('Give me a lorem ipsum.', true, new Date('2026-02-22T01:06:23')), new ChatEntry('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', false, new Date('2026-02-22T01:07:00'))];

/**
 * Initialize the demo with a Chat instance and dummy data.
 */
export class RouterDemo extends LitElement {
  static get properties () {
    return {};
  }

  constructor () {
    super();
    // initialize chat with dummy data
    this.chat = new Chat([...dummyChat]);
  }

  render () {
    return html`
        <router-chat .chat=${this.chat}></router-chat>`;
  }

  static get styles () {
    return css`
        :host {
            display: block;
            width: 100%;
        }
    `;
  }
}

window.customElements.define('router-demo', RouterDemo);
