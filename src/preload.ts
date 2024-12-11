const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    requestDecks: () => ipcRenderer.invoke('sql:requestDecks'),
    addNewCard: (deckName:string,card_front:string,card_back:string) => ipcRenderer.invoke('sql:addNewCard',deckName,card_front,card_back),
  })