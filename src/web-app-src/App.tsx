import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import '../index.css';
import "katex/dist/katex.min.css";


function App() {
    const [page,setPage] = useState("add");
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
                    <CardEditor availableDecks={decks} updateDecks={setDecks} /> :
                    <DecksViewer availableDecks={decks} />
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


function CardEditor(props:any) {
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
            <LatexEditor title={'Card Front'} cardValueSetter={setCardFront} />
            <LatexEditor title={'Card Back'} cardValueSetter={setCardBack} />
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
    const [inputValue, setInputValue] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        katex.render(String.raw`${inputValue}`,ref.current, {throwOnError: false});
    });

    return (
        <>
            <div className='latex-editor'>
                <h3 className='title'>{props.title}</h3>
                <div ref={ref}></div>
                <textarea onChange={event => {
                    setInputValue(event.target.value);
                    props.cardValueSetter(event.target.value);
                    katex.render(String.raw`${inputValue}`,ref.current, {throwOnError:false})
                }} />
            </div>
        </>
    )
}


export default App