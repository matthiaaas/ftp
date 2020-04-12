export default class ThemeProvider {
  constructor() {
    // preinstalled themes
    this.themes = [
      {
        name: "default-dark",
        id: "theme:dark",
        type: "dark",
        author: "default",
        description: "default dark theme",
        colors: {
          "--color-white": "#FFFFFF",
          "--color-black": "#0A0A0B",
          "--color-dark": "#141417",
          "--color-dark-blur": "rgba(20, 20, 23, 0.72)",
          "--color-dark-light": "#1D1D21",
          "--color-dark-grey": "#26262C",
          "--color-dark-grey-blur": "rgba(36, 38, 44, 0.2)",
          "--color-grey-dark": "#343842",
          "--color-grey": "#616A87",
          "--color-grey-light": "#8890A5"
        }
      },
      {
        name: "default-light",
        id: "theme:light",
        type: "light",
        author: "default",
        description: "default light theme",
        colors: {
          "--color-dark": "#f8f8f8",
          "--color-dark-light": "#edeef2",
          "--color-dark-grey": "#ebeef5",
          "--color-grey": "#727a81",
          "--color-grey-light": "#3c4459",
          "--color-grey-dark": "#ebeef5",
          "--color-dark-grey-blur": "#f7f7f7",
          "--color-black": "white",
          "--color-white": "#354353"
        }
      },
      {
        name: "default-ghost",
        id: "theme:ghost",
        type: "dark",
        author: "default",
        description: "default ghost theme",
        colors: {
          "--color-dark": "#24242c",
          "--color-dark-light": "#33333d",
          "--color-dark-grey": "#2f2f37",
          "--color-black": "#1d1d25",
          "--color-white": "white"
        }
      },
      {
        name: "dark-blue",
        id: "theme:dark-blue",
        type: "dark",
        author: "default",
        description: "dark blue variant theme",
        colors: {
          "--color-white": "#FFFFFF",
          "--color-black": "#141417",
          "--color-dark": "#1c1c25",
          "--color-dark-blur": "rgba(20, 20, 23, 0.72)",
          "--color-dark-light": "#22222c",
          "--color-dark-grey": "#26262C",
          "--color-dark-grey-blur": "rgba(36, 38, 44, 0.2)",
          "--color-grey-dark": "#343842",
          "--color-grey": "#616A87",
          "--color-grey-light": "#8890A5"
        }
      }
    ];
  }

  getAllThemes() {
    return this.themes;
  }

  changeTheme(id) {
    let theme = this.themes[this.themes.findIndex(theme => theme.id === id)];
    document.getElementsByTagName("html")[0].classList.add("theme-transition");
    Object.keys(theme.colors).map((key) => {
      const value = theme.colors[key];
      return document.documentElement.style.setProperty(key, value);
    })
    setTimeout(() => {
      document.getElementsByTagName("html")[0].classList.remove("theme-transition");
    }, 800);
  }
}
