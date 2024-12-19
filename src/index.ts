import { app, BrowserWindow, ipcMain } from 'electron';
const database = require("./db-src/dbms")
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

database.uploadTables();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  ipcMain.handle("sql:requestDecks",async () => {
    return database.hashTables; //was db.tables
  });
  ipcMain.handle("sql:addNewCard", async (event:any, deckName:string, card_front:string, card_back:string,last_studied_time:string) => {
    database.addNewCard(deckName,card_front,card_back,last_studied_time);
    database.uploadTables();
    return database.hashTables;
  });
  ipcMain.handle("sql:addNewDeck", async (event:any,deckName:string) => {
    database.createNewDeck(deckName); 
    database.uploadTables(); //need to be invoked every time a change is done to db or else data held is not up to date
    return database.hashTables;
  });
  ipcMain.handle("sql:retrieveDeckCards", async (event:any,deckName:string) => {
    return database.retrieveDeckCards(deckName);
  });
  ipcMain.handle("sql:updateCard", async (event:any, deckName:string, card_front:string, card_back:string, ID:number) => {
    database.updateCard(deckName,card_front,card_back,ID);
    database.uploadTables();
    return database.hashTables;
  });
  ipcMain.handle("sql:retrieveLessonCards", async (event:any, deckName:string,currentDate:string) => {
    return database.retrieveLessonCards(deckName,currentDate);
  });
  ipcMain.handle("sql:updateCardDueTime", async (event:any,deckName:string,card_id:number,last_studied_time:string,days_until_review:number) => {
    database.updateCardDueTime(deckName,card_id,last_studied_time,days_until_review);
    database.uploadTables();
    return database.hashTables;
  });
  ipcMain.handle("sql:returnCardCount",async (event:any,deckName:string) => {
    return database.returnCardCount(deckName);
  });
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
