const path = require("path");
const { app, BrowserWindow, Menu } = require("electron");
const isDev = require("electron-is-dev");

const isMac = process.platform === "darwin";

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true
    },
    minWidth: 720,
    minHeight: 500,
    maxWidth: 900,
    maxHeight: 600,
    backgroundColor: "#141417"
  })

  const menu = Menu.buildFromTemplate([
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Preferences",
          enabled: false,
          accelerator: "CmdOrCtrl+,"
        },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    }] : []),
    {
      label: "Session",
      submenu: [
        {
          label: "New Folder",
          accelerator: "CmdOrCtrl+Shift+N",
          click: () => {
            console.log("new folder")
          }
        },
        {
          label: "New File",
          enabled: false,
          accelerator: "CmdOrCtrl+Shift+F",
          click: () => {
            console.log("new file")
          }
        },
        { type: "separator" },
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            console.log("reloading")
          }
        },
        {
          label: "Search...",
          enabled: false,
          accelerator: "CmdOrCtrl+F",
          click: () => {
            console.log("searching")
          }
        },
        { type: "separator" },
        {
          label: "Disconnect",
          enabled: false,
          accelerator: "CmdOrCtrl+D",
          click: () => {
            console.log("disconnecting")
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectall" }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Connect",
          enabled: false
        },
        { type: "separator" },
        {
          label: "Preferences",
          enabled: false,
          accelerator: "CmdOrCtrl+,"
        },
        { type: "separator" },
        {
          label: "Session",
          enabled: false
        },
        {
          label: "Terminal",
          enabled: false
        },
        {
          label: "Statistics",
          enabled: false
        },
        { type: "separator" },
        {
          label: "QuickConnect",
          enabled: false
        }
      ]
    },
    {
      label: "Debug",
      submenu: [
        { role: "toggledevtools" }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" }, 
        isMac ? { role: "close" } : { role: "quit" },
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Github Repository",
          click: async () => {
            const { shell } = require("electron")
            await shell.openExternal("https://github.com/matthiaaas/ftp")
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  win.loadURL(
    isDev ? "http://localhost:3000/"
    : `file://${path.join(__dirname, "../build/index.html")}`
  )
  
  win.removeMenu()

  if (isDev) {
    // Open the DevTools.
    win.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
