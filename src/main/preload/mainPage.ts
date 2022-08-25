const electron = require('electron')
const fs = require('fs')
console.log(fs)

console.log('main page preload loaded');

electron.contextBridge.exposeInMainWorld('apis', {
    ipcRenderer: electron.ipcRenderer,
    platform: process.platform,
    fs,
    onMessage: (fn: any) => {
        electron.ipcRenderer.on('message', (event, text) => {
            fn?.(text)
        })
    }
})
