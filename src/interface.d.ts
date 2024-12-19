export interface IElectronAPI {
    requestDecks: () => Promise<any>,
    addNewCard: (deckName:string,card_front:string,card_back:string,last_studied_time:string) => Promise<any>,
    addNewDeck: (deckName:string) => Promise<any>,
    retrieveDeckCards: (deckName:string) => Promise<any>,
    updateCard: (deckName:string,card_front:string,card_back:string,ID:number) => Promise<any>,
    retrieveLessonCards: (deckName:string, currentDate:string) => Promise<any>,
    updateCardDueTime: (deckName:string,card_id:number,last_studied_time:string,days_until_review:number) => Promise<any>,
    returnCardCount: (deckName:string) => Promise<any>,
  }
  
  declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }