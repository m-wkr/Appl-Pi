export interface IElectronAPI {
    requestDecks: () => Promise<any>,
    addNewCard: (deckName:string,card_front:string,card_back:string) => Promise<any>
  }
  
  declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }