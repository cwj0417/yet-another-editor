import { app, BrowserWindow, globalShortcut, ipcMain, Notification, TouchBar, Menu, MenuItemConstructorOptions, dialog } from 'electron'
import mainPreload from '@/preload/mainPage.ts'
// import stickyPreload from '@/preload/stickyPage.ts'
import mainPage from '@/renderer/index.html#/home'
import { BrowserWindowConstructorOptions } from 'electron/main'
import { keyToAccelerator, userPath, getUserConf, useUserData } from './utils'
import { readdirSync, unlinkSync } from 'fs'
import { join } from 'path'
import { autoUpdater } from "electron-updater"
import type { UpdateInfo } from 'electron-updater'
import { notification } from "../type"
import { toRaw } from 'vue'

import log from 'electron-log';

log.transports.file.level = 'debug'
autoUpdater.logger = log;
log.info('App starting...');

let mainWindow: BrowserWindow | null = null

autoUpdater.on('checking-for-update', () => {
  mainWindow!.webContents.send('message', {
    type: 'checking-for-update',
  });
})
autoUpdater.on('update-available', (info: UpdateInfo) => {
  mainWindow!.webContents.send('message', {
    type: 'update-available',
    value: info,
  });
})
autoUpdater.on('update-not-available', (info) => {
  mainWindow!.webContents.send('message', {
    type: 'update-not-available',
  });
})
autoUpdater.on('error', (err) => {
  mainWindow!.webContents.send('message', {
    type: 'update-error',
    value: err,
  });
})
autoUpdater.on('download-progress', (progressObj) => {
  // let log_message = "Download speed: " + progressObj.bytesPerSecond;
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
})
autoUpdater.on('update-downloaded', (info) => {
});

let mainWindowConfig: BrowserWindowConstructorOptions = {
  width: 960,
  minWidth: 960,
  height: 552,
  minHeight: 552,
  frame: false,
  webPreferences: {
    preload: mainPreload,
  }
}

const windowConf: {
  [prop in 'main' | 'timer' | 'schedule' | 'inspiration']: {
    url: string,
    conf: BrowserWindowConstructorOptions
  }
} = {
  main: {
    url: mainPage,
    conf: {
      width: 960,
      minWidth: 960,
      height: 552,
      minHeight: 552,
      frame: false,
      webPreferences: {
        preload: mainPreload,
      }
    },
  },
}

function createWindow(type: keyof typeof windowConf = 'main') {

  if (mainWindow) {
    if (mainWindow!.webContents.getURL() !== windowConf[type].url) mainWindow!.loadURL(windowConf[type].url)
    mainWindow!.show()
  } else {
    mainWindow = new BrowserWindow({
      ...mainWindowConfig,
      show: false,
    })
    mainWindow.once('ready-to-show', mainWindow.show)
    mainWindow!.loadURL(windowConf[type].url)
    mainWindow?.on('close', () => {
      mainWindow = null;
    })
  }
}


app.whenReady().then(() => {
  createWindow()
})

app.on('activate', () => {
  if (!mainWindow) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const template: MenuItemConstructorOptions[] = [
  {
    role: 'appMenu'
  },
  {
    label: 'File',
    submenu: [
    {
      role: 'toggleDevTools'
    },
    {
      role: 'close'
    },
    {
      label: 'check for updates',
      click: () => {
        autoUpdater.checkForUpdates()
      }
    },
    {
      label: 'gototo homepage',
      accelerator: 'CmdOrCtrl+Shift+H',
      click: () => {
        createWindow()
      }
    },
    ]
  },
  { role: 'editMenu' }
]

Menu.setApplicationMenu(Menu.buildFromTemplate(template))

ipcMain.handle('getUserPath', () => userPath)

ipcMain.handle('getVersion', () => app.getVersion())

ipcMain.handle('getNotificationQ', () => notificationQ)

ipcMain.on('checkforupdate', (event) => {
  autoUpdater.checkForUpdates()
})

autoUpdater.checkForUpdatesAndNotify()

let notificationQ: notification[] = []

let notificationHandlers: {
  [id: number]: NodeJS.Timeout
} = {}
