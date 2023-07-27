export default class ChatAPI {
  constructor(url) {
    this.baseURL = url;
  }

  // опции для запроса
  static options(method, urlParam, body) {
    const value = {
      method,
      body: JSON.stringify(body),
      urlParam,
    };

    return value;
  }

  // создание апи запроса
  async createRequest(options) {
    const { method, urlParam, body } = options;

    const newUrl = `${this.baseURL}/${urlParam}`;

    const response = await fetch(newUrl, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body,
    });

    const result = await response.json();

    if (!result) { return false; }

    return result;
  }

  // логинизация
  async logining(body) {
    // опции для запроса и запрос на сервер
    const options = this.constructor.options('POST', '?method=logining', body);
    const response = await this.createRequest(options);

    // проверка, есть ли нужный объект
    // const { login } = response;

    return response;
  }
}
