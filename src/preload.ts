const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    requestDecks: () => ipcRenderer.invoke('sql:requestDecks'),
    addNewCard: (deckName:string,card_front:string,card_back:string,last_studied_time:number) => ipcRenderer.invoke('sql:addNewCard',deckName,card_front,card_back,last_studied_time),
    addNewDeck: (deckName:string) => ipcRenderer.invoke('sql:addNewDeck',deckName),
    retrieveDeckCards: (deckName:string) => ipcRenderer.invoke('sql:retrieveDeckCards',deckName),
    updateCard: (deckName:string,card_front:string,card_back:string,ID:number) => ipcRenderer.invoke('sql:updateCard',deckName,card_front,card_back,ID),
    retrieveLessonCards: (deckName:string,currentDate:string) => ipcRenderer.invoke('sql:retrieveLessonCards',deckName,currentDate),
    updateCardDueTime: (deckName:string,card_id:number,last_studied_time:string,days_until_review:number) => ipcRenderer.invoke('sql:updateCardDueTime',deckName,card_id,last_studied_time,days_until_review),
    returnCardCount: (deckName:string) => ipcRenderer.invoke('sql:returnCardCount',deckName),
})