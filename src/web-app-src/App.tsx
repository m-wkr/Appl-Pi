import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import '../index.css';
import "katex/dist/katex.min.css";

//to do, fix classnames to use same typing convention. camelCasing should be utilised

function App() {
    const [page,setPage] = useState("tee");
    const [decks, setDecks] = useState({}); //decks need to be accessed by several sub pages, so we might as well keep the value in app


    useEffect(() => {
        const ready = async () => {
            setDecks(await window.electronAPI.requestDecks());
        }
        ready();
    })


    return (
        <>
            <NavigationBar pageSetter={setPage}/>
            <div className='page-body'>
                {
                    page === "add" ? <CardAppender availableDecks={decks} updateDecks={setDecks} /> 
                    : page === "view" ? <ViewCards decks={decks} updateDecks={setDecks}/> 
                    :  <DecksViewer availableDecks={decks} updateDecks={setDecks}/>
                }
            </div>
        </>
    )

}


function NavigationBar(props:any) {

    return (
        <>
            <div className='testing-bg'></div>
            <div className='testing'></div>
            <header>
                <nav>
                    <a onClick={() => props.pageSetter("deck")}>Decks</a>
                    <a onClick={() => props.pageSetter("add")}>Add</a>
                    <a onClick={() => props.pageSetter("view")}>View Cards</a>
                </nav>
            </header>
        </>
    )
}

function ViewCards(props:any) {
    const readyDecks = Object.keys(props.decks).map(deck => <p onClick={() => {setSelectedDeck(deck);retrieveCards(deck)}}>{deck}</p>); 

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


    useEffect(() => {
        setSelectedCard({});
    },[selectedDeck]) //when a new deck is selected, the current latex card editor is reset */



    return (
        <>
            {readyDecks}
            <h1>{selectedDeck}</h1>
            {readyCards}
            {Object.keys(selectedCard).length ? <CardEditor deck={selectedDeck} setDeck={props.updateDecks} card={selectedCard} updateCards={retrieveCards}/> : <></>} 
        </>
    ) //Now we can toggle the card editor view
}

function CardEditor(props:any) {
    const belongedDeck = props.deck;
    const [cardFront,setCardFront] = useState(props.card.card_front);
    const [cardBack,setCardBack] = useState(props.card.card_back);

    useEffect(() => {
        setCardFront(props.card.card_front);
        setCardBack(props.card.card_back)
    },[props.card])

    const updateCard = async () => {
        props.setDeck(await window.electronAPI.updateCard(props.deck,cardFront,cardBack,props.card.ID));
        props.updateCards(belongedDeck); //all it took to update cards...
    }




    return (
        <>
            <LatexEditor title={"Card Front"} cardValueSetter={setCardFront} value={cardFront} />
            <LatexEditor title={"Card Back"} cardValueSetter={setCardBack} value={props.card.card_back} />
            <button onClick={() => {
                updateCard();
            }}></button>
        </>
    )

}

//TBC
function DecksViewer(props:any) {
    const [lessonStart, setLessonStart] = useState(false);
    const [selectedDeck,setSelectedDeck] = useState("");
    const readyDecks = Object.keys(props.availableDecks).map(i => <li onClick={() => {setSelectedDeck(i);setLessonStart(true)}}>{i}</li>);

    return (
        lessonStart ? <LessonSpace deckName={selectedDeck} returnFunction={setLessonStart} updateDecks={props.updateDecks}/> 
        : 
            <ul>
                {readyDecks}
            </ul>
    )
}

function LessonSpace(props:any) {
    const currentDate = new Date().toISOString().split("T")[0]
    const [cardsQueue,setCardsQueue] = useState([]);
    const [cardFront, setCardFront] = useState("");
    const [cardBack, setCardBack] = useState("");
    const [isFront, setIsFront] = useState(true);

    useEffect(() => {
        const retrieveCardsForLesson = async () => {
            setCardsQueue(await window.electronAPI.retrieveLessonCards(props.deckName,currentDate))
        }
        retrieveCardsForLesson();
    },[]);

    useEffect(() => {
        if (cardsQueue.length) {
            setCardFront(cardsQueue[0].card_front);
            setCardBack(cardsQueue[0].card_back);
        }
    },[cardsQueue]);

    function completeCard() {
        //window.electronAPI.updateCardDueTime(props.deckName,cardsQueue[0].ID,currentDate,daysDue);
        setCardsQueue(cardsQueue.splice(1));
    };

    function enqueueCardToBack() {
        const currentCard = cardsQueue[0];
        setCardsQueue([...cardsQueue.splice(1),currentCard]);
    }

    if (cardsQueue.length) {
        if (isFront) {
            return (<div className='lesson-space'>
                <h1>{cardFront}</h1>
                <button onClick={() => setIsFront(false)}>Show Answer</button>
            </div>)
        } else {
            return (<div className='lesson-space'>
                <h1>{cardBack}</h1>
                <button onClick={() => {enqueueCardToBack();setIsFront(true)}}>Try Again</button>
                <button onClick={() => {
                    if (cardsQueue.length > 1) { 
                        completeCard();
                        setIsFront(true) 
                    } else {
                        props.returnFunction(false);
                    }
                    props.updateDecks(window.electronAPI.updateCardDueTime(props.deckName,cardsQueue[0].ID,currentDate,5))

                }}>Completed</button>
            </div>)
        }
    }
}

function CardAppender(props:any) {
    const availableDecks = props.availableDecks;
    const [selectedDeck,setSelectedDeck] = useState(undefined);
    const [cardFront, setCardFront] = useState("");
    const [cardBack, setCardBack] = useState("");

    useEffect(() => {
        setSelectedDeck(Object.keys(props.availableDecks)[0])
    },props.availableDecks)

    const addNewCard = () => {
        const addCard = async () => {
            //date is stored in yyyy-mm-dd format
            const creationDate = new Date();
            const sqlDateFormat = creationDate.toISOString().split("T")[0];
            //console.log(new Date("2023-11-12").toISOString())
            props.updateDecks(await window.electronAPI.addNewCard(selectedDeck,cardFront,cardBack,sqlDateFormat));
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
                <textarea  value={inputValue} onChange={event => { 
                    setInputValue(event.target.value);
                    props.cardValueSetter(event.target.value);
                    katex.render(String.raw`${inputValue}`,ref.current, {throwOnError:false})
                }} />
            </div>
        </>
    )
}


export default App