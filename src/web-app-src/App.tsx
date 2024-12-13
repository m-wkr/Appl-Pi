import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import '../index.css';
import "katex/dist/katex.min.css";


function App() {
    const [page,setPage] = useState("view");
    const [decks, setDecks] = useState({}); //decks need to be accessed by several sub pages, so we might as well keep the value in app


    useEffect(() => {
        const ready = async () => {
            setDecks(await window.electronAPI.requestDecks());
        }
        ready();
    })


    return (
        <>
            <NavigationBar />
            <div className='page-body'>
                {
                    page === "add" ?
                    <CardAppender availableDecks={decks} updateDecks={setDecks} /> :
                    (page === "view" ? <ViewCards decks={decks} updateDecks={setDecks}/> :
                    <DecksViewer availableDecks={decks}/>)
                }
            </div>
        </>
    )

}

//TBC
function NavigationBar() {
    return (
        <>
            <div className='testing-bg'></div>
            <div className='testing'></div>
            <header>
                <nav>
                    <p>Decks</p>
                    <p>Add</p>
                    <p>View Cards</p>
                </nav>
            </header>
        </>
    )
}

function ViewCards(props:any) {
    const readyDecks = Object.keys(props.decks).map(deck => <p onClick={() => {setSelectedDeck(deck);retrieveCards(deck)}}>{deck}</p>)
    const [selectedDeck, setSelectedDeck] = useState("");
    const [cards, setCards] = useState([]);
    const readyCards = cards.map(card => <p onClick={() => setSelectedCard(card)}>{card["card_front"]}</p>);
    const [selectedCard, setSelectedCard] = useState({});

    const retrieveCards = (deck:string) => {
        const ready = async () => {
            setCards(await window.electronAPI.retrieveDeckCards(deck));
        }
        ready();
    }


    return (
        <>
            {readyDecks}
            <h1>{selectedDeck}</h1>
            {readyCards}
            <CardEditor deck={selectedDeck} setDeck={props.updateDecks} card={selectedCard}/>
        </>
    )
}

function CardEditor(props:any) {
    const belongedDeck = props.deck;
    const [cardFront,setCardFront] = useState(props.card.card_front);
    const [cardBack,setCardBack] = useState(props.card.card_back);

    const updateCard = async () => {
        props.setDeck(await window.electronAPI.updateCard(props.deck,cardFront,cardBack,props.card.ID));
    }

    useEffect(() => {
        setCardFront(props.card.card_front);
        setCardBack(props.card.card_back);
    },[props.deck,props.card])

    return (
        <>
            <LatexEditor title={"Card Front"} cardValueSetter={setCardFront} value={props.card.card_front} />
            <LatexEditor title={"Card Back"} cardValueSetter={setCardBack} value={props.card.card_back} />
            <button onClick={() => {
                updateCard();
            }}></button>
        </>
    )

}

//TBC
function DecksViewer(props:any) {
    const readyDecks = Object.keys(props.availableDecks).map(i => <li>{i}</li>);

    return (
        <>
            <ul>
                {readyDecks}
            </ul>
        </>
    )
}


function CardAppender(props:any) {
    const availableDecks = props.availableDecks;
    const [selectedDeck,setSelectedDeck] = useState(undefined);
    const [cardFront, setCardFront] = useState("");
    const [cardBack, setCardBack] = useState("");

    const addNewCard = () => {
        const addCard = async () => {
            props.updateDecks(await window.electronAPI.addNewCard(selectedDeck,cardFront,cardBack));
        }
        addCard();
        setCardFront("");
        setCardBack("");
    }


    return (
        <>
            <CreateNewDeck availableDecks={availableDecks} currentlySelected={selectedDeck} changeSelected={setSelectedDeck} changeDecks={props.updateDecks}/>
            <LatexEditor title={'Card Front'} cardValueSetter={setCardFront} value={cardFront}/>
            <LatexEditor title={'Card Back'} cardValueSetter={setCardBack} value={cardBack} />
            <button onClick={() => addNewCard()}>Create Card</button>
        </>
    )
}

function CreateNewDeck(props:any) {
    const options = Object.keys(props.availableDecks).map(deck => 
        <option value={deck}>{deck}</option>
    )
    const [newDeck, setNewDeck] = useState(true);
    const [newDeckName,setNewDeckName] = useState("");


    const createNewDeck = () => {
        if (newDeckName) {
            const submitNewDeckName = async () => {
                props.changeDecks(await window.electronAPI.addNewDeck(newDeckName.replace(/\s/g, "-"))); //sql requires deckNames to not have spaces, resolve that later
            };
            submitNewDeckName();
            setNewDeck(false);
            setNewDeckName("");
        }
    }

    return (
        <>
            <h1>Currently selected deck is {props.currentlySelected}</h1>
            <label>Select a deck</label>
            <select value={props.currentlySelected} onChange={event => {
                    if (event.target.value !== "CND") {
                        props.changeSelected(event.target.value); //might be moved under conditional
                        setNewDeck(false);
                    } else {
                        setNewDeck(true);
                    }
                }}>
                {options}
                <option value={"CND"}>Create New Deck</option> {/*TBC */}
            </select>
            {newDeck ? <>
                <input value={newDeckName} onChange={(event:any) => setNewDeckName(event.target.value)}></input><button onClick={createNewDeck}>Create New Deck</button>
            </> : <></>}
        </>
    )
}

function LatexEditor(props:any) {
    const [inputValue, setInputValue] = useState(props.value);
    const ref = useRef(null);

    // Render katex string
    useEffect(() => {
        katex.render(String.raw`${inputValue}`,ref.current, {throwOnError: false});
    },[inputValue]);

    //MASSIVE NOTES, you can have multiple useEffects, and you can list dependencies so that when those values update, it'll run the effect :D
    useEffect(() => {
        setInputValue(props.value)
    },[props.value])

    return (
        <>
            <div className='latex-editor'>
                <h3 className='title'>{props.title}</h3>
                <div ref={ref}></div>
                <textarea defaultValue={props.value} onChange={event => { //defaultValue fixed it :D
                    setInputValue(event.target.value);
                    props.cardValueSetter(event.target.value);
                    katex.render(String.raw`${inputValue}`,ref.current, {throwOnError:false})
                }} />
            </div>
        </>
    )
}


export default App