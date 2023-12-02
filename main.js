const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  Menu,
  Tray,
} = require("electron");
const path = require("path");

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

function createTray() {
  const trayIcon = path.join(__dirname, "path/to/trayIcon.png");
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setToolTip("Quiz App");
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

ipcMain.on("show-notification", (event, message) => {
  const notification = new Notification({ title: "Quiz App", body: message });
  notification.show();
});

ipcMain.on("show-modal", (event, message) => {
  mainWindow.webContents.send("show-modal", message);
});

ipcMain.on("start-quiz", (event, questions) => {
  mainWindow.webContents.send("start-quiz", questions);
});

ipcMain.on("show-final-score", (event, score) => {
  mainWindow.webContents.send("show-final-score", score);
});
