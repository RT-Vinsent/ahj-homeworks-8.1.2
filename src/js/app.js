/* eslint-disable no-console */
import ChatDOM from './ChatDOM';
import ChatControl from './ChatControl';
import ChatWS from './ChatWS';
import ChatAPI from './ChatAPI';

// const urlString = 'http://localhost:7070';
const url = 'https://ahj-hw8-1.onrender.com';
const urlWS = 'wss://ahj-hw8-1.onrender.com';
// const urlString = `${url}:7070`;

// элемент блока div в DOM
const hw = document.querySelector('#hw');

// создание класса отвечающего за DOM
const chatDOM = new ChatDOM();

// присвоению блока DIV, класса отвечающего за DOM
chatDOM.bindToDOM(hw);

// создание класса отвечающего за вебсокет
const chatWS = new ChatWS(urlWS);

// создание класса отвечающего за API
const chatAPI = new ChatAPI(url);

// создание класса отвечающего за контроль
const chatControl = new ChatControl(chatDOM, chatWS, chatAPI);

chatControl.init();

console.log('app started');
