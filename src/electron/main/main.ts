import { join } from 'path';
import { app, BrowserWindow, ipcMain, dialog, screen, Menu } from 'electron';
import { checkAndApplyUpdates } from './updater'

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ title: "Open File" });
  if (!canceled) {
    return filePaths[0];
  }
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
    },
    icon: join(__dirname, '../../../../public/logotypeadelix.ico')
  });

  mainWindow.maximize();

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../../index.html'));

    Menu.setApplicationMenu(null);

    // mainWindow.webContents.on('devtools-opened', () => {
    //   mainWindow.webContents.closeDevTools();
    // });
    //
    // mainWindow.webContents.on('before-input-event', (event, input) => {
    //   if (input.key === 'F12' || (input.control && input.shift && input.key === 'I')) {
    //     event.preventDefault();
    //   }
    // });
  }

  setTimeout(() => {
    checkAndApplyUpdates()
  }, 1500)
};

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen);
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});