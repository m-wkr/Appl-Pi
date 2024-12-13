export interface IElectronAPI {
    requestDecks: () => Promise<any>,
    addNewCard: (deckName:string,card_front:string,card_back:string) => Promise<any>,
    addNewDeck: (deckName:string) => Promise<any>,
    retrieveDeckCards: (deckName:string) => Promise<any>,
    updateCard: (deckName:string,card_front:string,card_back:string,ID:number) => Promise<any>,
  }
  
  declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }