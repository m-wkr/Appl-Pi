const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    requestDecks: () => ipcRenderer.invoke('sql:requestDecks'),
    addNewCard: () => ipcRenderer.invoke('sql:addNewCard',"testing","1","2")
  })