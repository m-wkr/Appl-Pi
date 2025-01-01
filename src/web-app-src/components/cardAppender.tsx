import {useState,useEffect} from 'react';
import './cardAppender.css';
import LatexEditor from './latexEditor';

function CardAppender(props:any) {
    const availableDecks = props.availableDecks;
    const [selectedDeck,setSelectedDeck] = useState("C N D");
    const [cardFront, setCardFront] = useState("");
    const [cardBack, setCardBack] = useState("");

    useEffect(() => {
        if (Object.keys(props.availableDecks)[0]) {
            setSelectedDeck(Object.keys(props.availableDecks)[0])
        }
    },[props.availableDecks])

    const addNewCard = () => {
        if (cardFront && cardBack) {
            const addCard = async () => {
                //date is stored in yyyy-mm-dd format
                const creationDate = new Date();
                const sqlDateFormat = creationDate.toISOString().split("T")[0];
                props.updateDecks(await window.electronAPI.addNewCard(selectedDeck,cardFront,cardBack,sqlDateFormat));
            }
            addCard();
            setCardFront("");
            setCardBack("");
        }
    }

    return (
        <div className='cardAdder'>
            <CreateNewDeck createNew={selectedDeck} availableDecks={availableDecks} currentlySelected={selectedDeck} changeSelected={setSelectedDeck} changeDecks={props.updateDecks}/>
            {selectedDeck !== "C N D" ? 
                <>
                <i><a target='_blank' href='https://katex.org/docs/supported.html'>See supported functions at katex.org</a></i>
                <LatexEditor title={'Card Front'} cardValueSetter={setCardFront} value={cardFront}/>
                <LatexEditor title={'Card Back'} cardValueSetter={setCardBack} value={cardBack} />
                <div className='adder'>
                <button onClick={() => addNewCard()}>Create Card</button>
                </div>
                </> : <></>
            }
        </div>
    )
};

function CreateNewDeck(props:any) {
    const options = Object.keys(props.availableDecks).map(deck => 
        <option key={deck} value={deck}>{deck}</option>
    )

    const [newDeck, setNewDeck] = useState(props.createNew === "C N D");
    const [newDeckName,setNewDeckName] = useState("");

    useEffect(() => {
        setNewDeck(props.createNew === "C N D")
    }, [props.createNew])

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
        <div className='adder'>
            <label>Select a deck</label>
            <select value={props.currentlySelected} onChange={event => {
                    if (event.target.value !== "C N D") {
                        setNewDeck(false);
                    } else {
                        setNewDeck(true);
                    }
                    props.changeSelected(event.target.value);
                }}>
                {options}
                <option value={"C N D"}>Create New Deck</option> {/*TBC */}
            </select>
            {newDeck ? <>
                <input placeholder='Your input must be unique' value={newDeckName} onChange={(event:any) => setNewDeckName(event.target.value)}></input>
                <button onClick={createNewDeck}>Create New Deck</button>
            </> : <></>}
        </div>
    )
};

export default CardAppender