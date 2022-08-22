const electron = require('electron')

console.log('main page preload loaded');


electron.contextBridge.exposeInMainWorld('apis', {
    ipcRenderer: electron.ipcRenderer,
    platform: process.platform,
    onMessage: (fn: any) => {
        electron.ipcRenderer.on('message', (event, text) => {
            fn?.(text)
        })
    }
})
