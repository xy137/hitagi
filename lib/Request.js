const fetch = require('cross-fetch');

class Request {
  constructor(API_KEY) {
    this.API_KEY = API_KEY;
    this.URL = 'https://storage.bunnycdn.com';
  }

  async get(storage, path, file) {
    const res = await fetch(`${this.URL}/${storage}/${path ? path + '/' : ''}${file}`, {
      method: 'GET',
      headers: { AccessKey: this.API_KEY },
    }).catch(err => console.log(err.response.status));
    if (!res) return;
    return { mime: res.headers.get('content-type'), stream: res.body };
  }

  async put(storage, path, file, image, mime) {
    const res = await fetch(`${this.URL}/${storage}/${path ? path + '/' : ''}${file}`, {
      headers: { 'Content-Type': mime, AccessKey: this.API_KEY },
      method: 'PUT',
      body: image,
    }).catch(err => console.log(err));
  }
}

module.exports = Request;