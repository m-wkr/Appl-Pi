const Database = require('better-sqlite3');

//TBC

const database = {
    dbObject: new Database("decks.db",{}),
    hashTables: {},

    uploadTables: function() {
        this.hashTables = this.dbObject.prepare("SELECT * FROM sqlite_master WHERE type='table'").all().reduce(function(map:any,obj:any) {
            map[obj.tbl_name] = "testing";
            return map;
        },{});
    },

    createNewDeck: function(deckName:string) {
        if (!this.hashTables[deckName]) {
            this.dbObject.prepare(`CREATE TABLE ${deckName} (ID INTEGER NOT NULL PRIMARY KEY, card_front TEXT, card_back TEXT)`).run();
        }
    },

    addNewCard: function(deckName:string,card_front:string,card_back:string) {
        if (this.hashTables[deckName]) {
            this.dbObject.prepare(`REPLACE INTO ${deckName}(card_front, card_back) VALUES('${card_front}','${card_back}')`).run();
        }
    },

    retrieveDeckCards: function(deckName:string) {
        return this.dbObject.prepare(`SELECT * FROM ${deckName}`).all();
    },

    updateCard: function(deckName:string, card_front:string, card_back:string, card_id:number) {
        if (this.hashTables[deckName]) {
            this.dbObject.prepare(`UPDATE ${deckName} SET card_front = '${card_front}', card_back = '${card_back}' WHERE ID = ${card_id}`).run();
        }
    }
}


module.exports = database;