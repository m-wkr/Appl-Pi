const Database = require('better-sqlite3');

//TBC

const database = {
    dbObject: new Database("test.db",{}),
    hashTables: {},

    uploadTables: function() {
        this.hashTables = this.dbObject.prepare("SELECT * FROM sqlite_master WHERE type='table'").all().reduce(function(map:any,obj:any) {
            map[obj.tbl_name] = "testing";
            return map;
        },{});
    },

    createNewDeck: function(deckName:string) {
        if (!this.hashTables[deckName]) {
            this.dbObject.prepare(`CREATE TABLE ${deckName} (ID INTEGER NOT NULL PRIMARY KEY, card_front TEXT, card_back TEXT, last_studied_time TEXT, days_until_review INTEGER)`).run();
        }
    },

    addNewCard: function(deckName:string,card_front:string,card_back:string,last_studied_time:string) {
        if (this.hashTables[deckName]) {
            this.dbObject.prepare(`REPLACE INTO ${deckName} (card_front, card_back, last_studied_time, days_until_review) VALUES('${card_front}','${card_back}','${last_studied_time}',0)`).run();
        }
    },

    retrieveDeckCards: function(deckName:string) {
        return this.dbObject.prepare(`SELECT * FROM ${deckName}`).all();
    },

    updateCard: function(deckName:string, card_front:string, card_back:string, card_id:number) {
        if (this.hashTables[deckName]) {
            this.dbObject.prepare(`UPDATE ${deckName} SET card_front = '${card_front}', card_back = '${card_back}' WHERE ID = ${card_id}`).run();
        }
    },

    retrieveLessonCards: function(deckName:string,currentDate:string) {
        return this.dbObject.prepare(`SELECT * FROM '${deckName}' WHERE julianday('${currentDate}') - julianday(last_studied_time) >= days_until_review UNION SELECT * FROM '${deckName}' WHERE days_until_review = 0 ORDER BY ID LIMIT 5`).all(); //should be correct
    },

    updateCardDueTime: function(deckName:string, card_id:number, last_studied_time:string,days_until_review:number) {
        if (this.hashTables[deckName]) {
            this.dbObject.prepare(`UPDATE ${deckName} SET last_studied_time = '${last_studied_time}', days_until_review = ${days_until_review} WHERE ID = ${card_id}`).run();
        } 
    }
}


module.exports = database;