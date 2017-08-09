const path = require('path');
const url = require('url');
const electron = require('electron');
const constantEvents = require('./src/_constants/events');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
/** @type {Electron.BrowserWindow | undefined} */
let mainWindow;

// TODO: Create a more modular createWindow function
// Create the browser window.
function createWindow() {
  const { minWidth, minHeight } = { minWidth: 800, minHeight: 600 };
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth,
    minHeight,
    backgroundColor: '#000',
    titleBarStyle: 'hidden'
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  electron.ipcMain.on(constantEvents.SYNC_GET_WINDOW_FOCUS_STATUS, evt => {
    evt.returnValue = mainWindow.isFocused();
  });

  // Media keys events
  // Copied from https://gist.github.com/twolfson/0a03820e27583cc9ad6e
  electron.globalShortcut.register('medianexttrack', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_NEXT_TRACK);
  });

  electron.globalShortcut.register('mediaprevioustrack', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_PREV_TRACK);
  });

  electron.globalShortcut.register('mediaplaypause', () => {
    mainWindow.webContents.send(constantEvents.MEDIA_PLAY_PAUSE);
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    console.log('All windows closed but not exiting because OSX');
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.