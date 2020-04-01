export default class Data {
  constructor(server, user) {
    this.init(server, user);

    this.user = user;
    this.server = server;
  }

  init(server, user) {
    let base = {};
    let storage = window.localStorage;

    if (storage.hasOwnProperty("servers")) {
      base = JSON.parse(storage.getItem("servers"));
    } else {
      storage.setItem("servers", JSON.stringify(base));
    }

    if (base[server] === undefined) {
      base[server] = {};
    } if (base[server][user] === undefined) {
      base[server][user] = {
        "name": server,
        "user": user,
        "path": "/",
        "cmds": []
      };
    }
    storage.setItem("servers", JSON.stringify(base))
  }

  _update(data) {
    window.localStorage.setItem("servers", JSON.stringify(data));
  }

  _get() {
    let data = JSON.parse(window.localStorage.getItem("servers"));
    
    return data;
  }

  set(key, value) {
    let data = this._get();

    data[this.server][this.user][key] = value;
    
    this._update(data);
  }

  get(key) {
    let data = this._get();

    return data[this.server][this.user][key];
  }
}
