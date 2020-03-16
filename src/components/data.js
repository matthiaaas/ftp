export default class Data {
  constructor(server) {
    this.init(server);

    this.server = server;
    this.socket = JSON.parse(window.localStorage.getItem("servers"));
  }

  init(server) {
    let base = {};
    let storage = window.localStorage;

    if (!storage.hasOwnProperty("servers")) {
      storage.setItem("servers", JSON.stringify(base));
    } else {
      base = JSON.parse(storage.getItem("servers"));
    }

    if (base[server] === undefined) {
      base[server] = {
        "name": server,
        "path": "/",
        "cmds": []
      };
      storage.setItem("servers", JSON.stringify(base))
    }
  }

  update() {
    window.localStorage.setItem("servers", JSON.stringify(this.socket));
  }

  set(key, value) {
    this.socket[this.server][key] = value;
    this.update();
  }

  get(key) {
    return (
      this.socket[this.server][key]
    )
  }
}
