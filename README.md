<div align="center">
  <img src="/assets/banner.png" alt="testing">
  <h3>Appl PI</h3>
  <p>Write elegant notes, save time on deciphering</p>
  <img src="https://img.shields.io/badge/Language-Typescript-blue.svg?style=flat&logo=TypeScript&logoColor=FFF">
  <img src="https://img.shields.io/badge/Version-v1.0.0-green.svg">
  <img src="https://img.shields.io/badge/Build-Passing-green.svg">
</div>

<hr>

## Preface

Appl Pi is a minimal notetaking flashcards app written with primary support of writing mathematical notation alongside standard english - providing a more coherent format for writing, 
and viewing flashcards.

>It was initially developed for personal use of recording Discrete Mathematics notes, however [KaTeX](https://katex.org/) provides 
>adjacent utility in similar fields beyond logic. For checking if KaTeX supports the branch of symbols for your notes, refer to [KaTeX's documentation](https://katex.org/docs/supported).

## UI Guidance

When the user opens the application, they are immediately greeted with the main menu which displays all of the user's available decks - and the respective number
of cards due. A deck can be clicked on to transport the user to lesson space to review due cards.

#### The navigation bar present on all screens allows the user to navigate:

- Decks, this refers to the main menu interface for viewing and reviewing cards.
- Add, this refers to the card & deck adding interface for adding new cards and decks.
- View Cards, this refers to the modification interface for editing and deleting resources.

### Lesson Space 

Within lesson space, the user is presented with the front of the card, and in turn the back of the card when the "Show Answer" button is clicked. The user is then
prompted with the choice to repeat the card, or to review it in a set interval. 

### Card Adding

To add a new card to a deck, select the deck you would like to add the new card. Then, write the card's content in each respective text box. 

>Note that the front card must not be empty.

### Deleting cards & decks

For deleting cards and decks, move to the "View Cards" section. Delete buttons will appear once the user **right clicks** onto a card, which then when clicked will
remove either the specified card, or the specified deck and all cards belonging to it.

### Modifying an existing card

Similarly, move to the "View Cards" section, then select the card you wish to modify. Once you are content with your change, press "Save Changes".

## How do I build this?

In order to build this project, first
1. Clone the repository: `git clone https://github.com/m-wkr/Appl-Pi`
2. Move into the cloned directory: `cd Appl-Pi`
3. Run `npm start` to build the app in development mode

## Technologies Used

#### Created web app UI with [Electron's toolkit containing:](https://www.electronforge.io/guides/framework-integration/react-with-typescript)
- [React](https://react.dev/)
- [Typescript](https://www.typescriptlang.org/)

#### Created Database interface with
- [Better-SQLite3](https://www.npmjs.com/package/better-sqlite3)

## Screenshots

| |
| - |
|![](/assets/decksViewer.png) |
|![](/assets/lessonFront.png) |
|![](/assets/lessonBack.png) |
|![](/assets/cardViewer.png) |
|![](/assets/cardAdder.png) |
![](/assets/deckAdder.png)
