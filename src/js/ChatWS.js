/* eslint-disable no-console */
export default class ChatWS {
  constructor(url) {
    this.ws = '';
    this.messageListeners = [];
    this.url = url;
  }

  init(username) {
    this.getUrlDomain();
    console.log(this.urlDomanPort);
    this.ws = new WebSocket(`${this.url}/ws?login=${username}`);

    this.ws.addEventListener('open', (e) => {
      console.log(e);
      console.log('ws open');
    });

    this.ws.addEventListener('close', (e) => {
      console.log(e);
      console.log('ws close');
    });

    this.ws.addEventListener('error', (e) => {
      console.log(e);
      console.log('ws error');
    });

    this.ws.addEventListener('message', (event) => this.onLoadMessage(event));
  }

  addMessageListeners(callback) { this.messageListeners.push(callback); }

  /*
  *  вызывается при получении сообщения от WS
  *  достаёт текст сообщения и возвращает его.
  *  автоматически вызывается в ChatControl
  */
  onLoadMessage(e) {
    const data = JSON.parse(e.data);
    const { chat: messages } = data;
    console.log(messages);

    messages.forEach((message) => {
      this.messageListeners.forEach((o) => o.call(null, message));
    });
  }
}
