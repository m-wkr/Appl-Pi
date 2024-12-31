import {useState,useEffect} from 'react';
import LatexEditor from './latexEditor';

function CardAppender(props:any) {
    const availableDecks = props.availableDecks;
    const [selectedDeck,setSelectedDeck] = useState(undefined);
    const [cardFront, setCardFront] = useState("");
    const [cardBack, setCardBack] = useState("");

    useEffect(() => {
        setSelectedDeck(Object.keys(props.availableDecks)[0])
    },[props.availableDecks])

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
};

function CreateNewDeck(props:any) {
    const options = Object.keys(props.availableDecks).map(deck => 
        <option key={deck} value={deck}>{deck}</option>
    )
    const [newDeck, setNewDeck] = useState(false);
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
                console.log(event.target.value)
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
};

export default CardAppender