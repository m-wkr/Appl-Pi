const Database = require('better-sqlite3');

const database = {
    dbObject: new Database("cards.db",{}),
    decksHashtable: {},

    //Should be used ONCE only. should be called first
    createDecksTable: function() {
        this.dbObject.prepare(`CREATE TABLE IF NOT EXISTS decks (deck_name TEXT NOT NULL PRIMARY KEY)`).run();
    },

    //should be used only once
    createCardDeck: function() {
        this.dbObject.prepare(`CREATE TABLE IF NOT EXISTS cards (card_ID INTEGER NOT NULL PRIMARY KEY, deck_name TEXT, card_front TEXT, card_back TEXT, last_studied_time TEXT, days_until_review INTEGER, FOREIGN KEY (deck_name) REFERENCES decks (deck_name) ON UPDATE CASCADE ON DELETE CASCADE)` /* REFERENCES daily (card_ID) ON UPDATE CASCADE ON DELETE CASCADE)`*/).run();
    },

    //daily card, should be used only once. 
    createDailyDeck: function() {
        this.dbObject.prepare(`CREATE TABLE IF NOT EXISTS daily (ID INTEGER NOT NULL PRIMARY KEY, card_ID INTEGER NOT NULL UNIQUE, lesson_start_date TEXT NOT NULL, FOREIGN KEY (card_ID) REFERENCES cards (card_ID) ON UPDATE CASCADE ON DELETE CASCADE)`).run();
    },

    //For uploading all decks - TBC
    uploadHashTable: function() {
        this.decksHashtable = this.dbObject.prepare("SELECT DISTINCT deck_name FROM decks").all().reduce(function(map:any,obj:any) {
            map[obj.deck_name] = "testing";
            return map;
        },{});
    },

    //Add a card to the deck
    addNewCard: function(deck_name:string,card_front:string,card_back:string,last_studied_time:string) {
        this.dbObject.prepare(`REPLACE INTO cards (deck_name, card_front, card_back, last_studied_time, days_until_review) VALUES('${deck_name}','${card_front}','${card_back}','${last_studied_time}',0)`).run();
    },

    updateCard: function(deck_name:string,card_front:string,card_back:string,card_id:number) {
        //deck_name is redundant, we'll work on it later
        if (this.decksHashtable[deck_name]) {
            this.dbObject.prepare(`UPDATE cards SET card_front = '${card_front}', card_back = '${card_back}' WHERE card_ID = ${card_id}`).run();
        }
    },

    // Non lesson, for editing
    retrieveCards: function(deck_name:string) {
        if (this.decksHashtable[deck_name]) {
            return this.dbObject.prepare(`SELECT * FROM cards WHERE deck_name = '${deck_name}'`).all();
        }
    },

    //set cards to be studied in daily
    setDailiesPerDeck: function(deck_name:string,currentDate:string) {
        const dailyCardsCount = this.dbObject.prepare(`SELECT COUNT(*) FROM cards INNER JOIN daily ON cards.card_ID = daily.card_ID WHERE daily.lesson_start_date = '${currentDate}' AND deck_name = '${deck_name}'`).get()["COUNT(*)"];
        //const newCardCount = this.dbObject.prepare(`SELECT COUNT(*) FROM cards INNER JOIN daily ON cards.card_ID = daily.card_ID WHERE days_until_review = 0 AND deck_name = '${deck_name}'`).get()["COUNT(*)"];
        //console.log(deck_name + dailyCardsCount + " " + newCardCount);

        if (!dailyCardsCount) {
            this.dbObject.prepare(`INSERT INTO daily (card_ID, lesson_start_date) SELECT card_ID, '${currentDate}' FROM cards WHERE julianday('${currentDate}') - julianday(last_studied_time) >= days_until_review AND deck_name = '${deck_name}' AND days_until_review <> 0 ON CONFLICT(card_ID) DO NOTHING`).run();
            //this.dbObject.prepare(`INSERT INTO daily (card_ID, lesson_start_date) SELECT card_ID, '${currentDate}' FROM cards WHERE days_until_review = 0 AND deck_name = '${deck_name}' ORDER BY card_ID LIMIT ${5-newCardCount} ON CONFLICT(card_ID) DO NOTHING`).run();
        }

        this.dbObject.prepare(`INSERT INTO daily (card_ID, lesson_start_date) SELECT card_ID, '${currentDate}' FROM cards WHERE days_until_review = 0 AND deck_name = '${deck_name}' ORDER BY card_ID ON CONFLICT(card_ID) DO NOTHING`).run();

        //ANKI DOESNT HAVE A CARD LIMIT ON NEWLY CREATED CARDS DUMBASS
    },

    //remove old daily cards
    deleteOldDailies: function(currentDate:string) {
        //this.dbObject.prepare(`DELETE FROM cards WHERE card_ID IN (SELECT card_ID FROM daily WHERE lesson_start_date <> '${currentDate}')`).run();
        this.dbObject.prepare(`DELETE FROM daily WHERE lesson_start_date <> '${currentDate}'`).run();
    },

    //Select cards for lesson
    selectLessonDailies: function(deck_name:string,currentDate:string) {
        return this.dbObject.prepare(`SELECT * FROM cards INNER JOIN daily ON cards.card_ID = daily.card_ID WHERE deck_name = '${deck_name}' AND (days_until_review = 0 OR last_studied_time <> '${currentDate}')`).all();
    },


    //Update card after lesson submission
    updateCardDueTime: function(card_id:number, last_studied_time:string,days_until_review:number) {
        this.dbObject.prepare(`UPDATE cards SET last_studied_time = '${last_studied_time}', days_until_review = ${days_until_review} WHERE card_ID = ${card_id}`).run();
    },

    //Create new card deck in decks table
    createNewDeck: function(deck_name:string) {
        if (!this.decksHashtable[deck_name]) {
            this.dbObject.prepare(`INSERT INTO decks (deck_name) VALUES('${deck_name}')`).run();
        }
    },

    //Return card count values
    returnCardCount: function(deck_name:string,currentDate:string) {
        return this.dbObject.prepare(`SELECT COUNT(*) FROM cards INNER JOIN daily ON cards.card_ID = daily.card_ID WHERE deck_name = '${deck_name}' AND (days_until_review = 0 OR last_studied_time <> '${currentDate}')`).get()["COUNT(*)"];
    },

    deleteCard: function(card_ID:string) {
        this.dbObject.prepare(`DELETE FROM cards WHERE card_ID = '${card_ID}'`).run();
    },

    deleteDeck: function(deck_name:string) {
        this.dbObject.prepare(`DELETE FROM decks WHERE deck_name = '${deck_name}'`).run();
    }
}


module.exports = {database};