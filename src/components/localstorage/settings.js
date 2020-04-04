export default class Settings {
  constructor() {
    if (!window.localStorage.hasOwnProperty("settings")) {
      window.localStorage.setItem("settings", JSON.stringify({}));
    }
  }

  _get() {
    let settings = JSON.parse(window.localStorage.getItem("settings"));
  
    return settings;
  }
  
  _update(settings) {
    window.localStorage.setItem("settings", JSON.stringify(settings));
  }
  
  get(key) {
    let settings = this._get();
  
    return settings[key];
  }
  
  set(key, value) {
    let settings = this._get();
  
    settings[key] = value;
  
    this._update(settings);
  }
  
}
