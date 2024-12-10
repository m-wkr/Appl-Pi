const Database = require('better-sqlite3');

//TBC

const DB:any = new Database("decks.db", {})

const tables = DB.prepare("SELECT * FROM sqlite_master WHERE type='table'").all().reduce(function(map:any,obj:any) {
    map[obj.tbl_name] = "testing";
    return map;
},{});


function createNewDeck(tables:any,deckName:string):boolean {
    if (!tables[deckName]) {
        DB.prepare(`CREATE TABLE ${deckName} (ID INTEGER NOT NULL PRIMARY KEY, card_front TEXT, card_back TEXT)`).run();
        return true;
    } 
    return false;
}

function addNewCard(tables:any,deckName:string,card_front:string,card_back:string) {
    if (tables[deckName]) {
        //This doesn't prevent duplicate entries, as a new row with a different pKey is generated
        DB.prepare(`REPLACE INTO ${deckName}(card_front, card_back) VALUES('${card_front}','${card_back}')`).run();
    }
}

function retrieveDeckCards(deckName:string) {
    return DB.prepare(`SELECT * FROM ${deckName}`).all();
}

addNewCard(tables,"testing","meow meow meow","meow?");
let newVal = DB.prepare("SELECT * FROM testing").all();



