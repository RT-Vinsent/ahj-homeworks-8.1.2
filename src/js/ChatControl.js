/* eslint-disable no-console */
export default class ChatControl {
  constructor(chatDOM, chatWS, chatAPI) {
    this.chatDOM = chatDOM; // класс который управляет DOM
    this.chatWS = chatWS; // класс который управляет WS
    this.chatAPI = chatAPI; // класс который управляет API
    this.login = '';
  }

  init() {
    this.chatDOM.drawUI();

    this.chatDOM.addOnLoginListeners(this.onLogin.bind(this));
    this.chatDOM.addGetMessageListeners(this.onSendMessage.bind(this));
    this.chatWS.addMessageListeners(this.onLoadMessage.bind(this));
  }

  async onLogin(login) {
    if (login.length === 0) {
      this.chatDOM.errorInputAdd('popUpLogin', 'Введите имя');
      return;
    }

    if (login.length < 3) {
      this.chatDOM.errorInputAdd('popUpLogin', 'Короткое имя');
      return;
    }

    const result = await this.chatAPI.logining({ login });

    if (result && result.status === true) {
      this.chatWS.init(login);
      this.chatDOM.popupClose();
      this.login = login;
    }

    if (result && result.status === false) {
      console.log(result);
      this.chatDOM.errorInputAdd('popUpLogin', 'Это имя уже есть в чате');
    }
  }

  /*
  *  вызывается при клике по кнопке
  *  отправляет сообщение в WS
  */
  onSendMessage(message) {
    const newMessage = JSON.stringify({ message, type: 'message' });
    console.log(newMessage);
    // newMessage.type = 'message';
    this.chatWS.ws.send(newMessage);
  }

  /*
  *  вызывается при получении сообщения от WS
  *  отрисовывает сообщение в DOM
  */
  onLoadMessage(message) {
    const messageEdit = message;
    console.log(messageEdit);
    if (message.type === 'message') {
      if (message.name === this.login) {
        messageEdit.classEl = 'message-right';
        messageEdit.name = 'You';
        this.chatDOM.loadMessage(messageEdit);
        return true;
      }
      if (message.name !== this.login) {
        messageEdit.classEl = 'message-left';
        this.chatDOM.loadMessage(messageEdit);
        return true;
      }
      return true;
    }

    if (message.type === 'user') {
      console.log(message.type);
      this.chatDOM.loadUser(message.names, this.login);
    }
    return false;
  }
}
