import {LitElement, css, html} from 'lit';

/**
 * Wrap all components in a basic demo.
 */
export class RouterDemo extends LitElement {
  static get properties () {
    return {};
  }

  constructor () {
    super();
  }

  render () {
    return html`
        <div>
            <p>Hello World</p>
        </div>
    `;
  }

  static get styles () {
    return css`
    `;
  }
}

window.customElements.define('router-demo', RouterDemo);
