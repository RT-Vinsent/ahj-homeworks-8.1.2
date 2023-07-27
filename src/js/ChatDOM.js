export default class chatDOM {
  constructor() {
    this.container = null; // for container

    this.onLoginListeners = [];
    this.getMessageListeners = [];
    // this.users = [];
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('ListEditPlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();

    this.container.innerHTML = `
      <header class="header">
        <p>Домашнее задание к занятию "8. EventSource, Websockets"</p>
        <p>Чат</p>
      </header>
      <div class="container">
        <div class="chat"></div>
        <div class="users"></div>
        <div class="chat-control">
          <input class="chat-message"/>
          <button class="chat-send">Отправить</button>
        </div>
      </div>
      <div class="popup">
        <form class="popup-container">
          <div class="popup-header">Выберите псевдоним</div>
          <input name="name" type="text" class="popup-login"/>
          <button class="popup-button">Продолжить</button>
        </form>
      </div>
    `;

    this.chat = this.container.querySelector('.chat');
    this.users = this.container.querySelector('.users');
    this.chatMessage = this.container.querySelector('.chat-message');
    this.chatSend = this.container.querySelector('.chat-send');
    this.popUp = this.container.querySelector('.popup');
    this.popUpSubmit = this.container.querySelector('.popup-container');
    this.popUpLogin = this.container.querySelector('.popup-login');

    this.popUpSubmit.addEventListener('submit', (event) => this.onLogin(event));
    this.chatSend.addEventListener('click', (event) => this.onSendMessage(event));
    this.popUpLogin.addEventListener('focus', () => this.onFocusClear('popUpLogin'));
  }

  addOnLoginListeners(callback) { this.onLoginListeners.push(callback); }

  onLogin(e) {
    e.preventDefault();
    const login = this.popUpLogin.value;
    this.popUpLogin.value = '';

    this.onLoginListeners.forEach((o) => o.call(null, login));
  }

  addGetMessageListeners(callback) { this.getMessageListeners.push(callback); }

  onSendMessage(e) {
    e.preventDefault();

    const message = String(this.chatMessage.value);
    if (!message) { return; }
    this.chatMessage.value = '';

    this.getMessageListeners.forEach((o) => o.call(null, message));
  }

  loadMessage(message) {
    const {
      name,
      text,
      date,
      classEl,
    } = message;
    const messageEl = this.constructor.getHtmlMessage(name, text, date);
    messageEl.classList.add(classEl);
    this.chat.appendChild(messageEl);
    this.chat.scrollTo(0, 9999); // где 0 - горизонтальная позиция, 9999 - вертикальная позиция
  }

  static getHtmlMessage(author, text, date) {
    const html = document.createElement('div');
    html.classList.add('message-container');
    // html.classList.add('message-left');
    // html.classList.add('message-left');
    html.innerHTML = `
      <div class="message">
        <div class="message-author">${author}, ${date}</div>
        <div class="message-text">${text}</div>
      </div>
    `;

    return html;
  }

  popupClose() {
    this.popUp.classList.add('close');
  }

  // текст в инпуте с ошибкой
  message(input, text) {
    this[input].placeholder = text;
  }

  onFocusClear(input) {
    this.message(input, '');
    this[input].classList.remove('error-add');
  }

  // добавляем инпуту класс ошибки
  errorInputAdd(input, text) {
    this[input].value = '';
    this.message(input, text);
    this[input].classList.add('error-add');
  }

  loadUser(users, login) {
    this.users.innerHTML = '';

    for (let i = 0; i < users.length; i += 1) {
      const userEl = document.createElement('div');
      userEl.classList.add('user');
      if (users[i] === login) {
        userEl.textContent = 'You';
      }
      if (users[i] !== login) {
        userEl.textContent = users[i];
      }

      this.users.appendChild(userEl);
    }
  }
}
