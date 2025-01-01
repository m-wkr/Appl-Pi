import {useState, useEffect} from 'react';
import './cardViewer.css';
import LatexEditor from './latexEditor';

function ViewCards(props:any) {
    const readyDecks = Object.keys(props.decks).map(deck => 
        <div className='readySet' key={deck}>
            <p onClick={() => {setSelectedDeck(deck);retrieveCards(deck)}}>{deck}</p>
            <button className='deleteButton' onClick={() => deleteDeck(deck)}>DEL</button>
        </div>
    ); 

    const deleteDeck = (deck_name:string) => {
        window.electronAPI.deleteDeck(deck_name).then(value => {
            props.updateDecks(value);
        })
    }

    const deleteCard = (card_ID:string) => {
        window.electronAPI.deleteCard(card_ID).then(value => {
            props.updateDecks(value);
        })
    }

    const [selectedDeck, setSelectedDeck] = useState("");
    const [cards, setCards] = useState([]);
    const readyCards = cards.map(card => 
        <div className='readySet' key={card["card_ID"]}>
            <p onClick={() => setSelectedCard(card)}>{card["card_front"]}</p>
            <button className='deleteButton' onClick={() => {deleteCard(card["card_ID"]);retrieveCards(card["deck_name"]);setSelectedCard({})}}>DEL</button>
        </div>
    );
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
        <div className='cardViewer'>
            <div className='dropDown'>
                <h2>Decks</h2>
                {readyDecks}
            </div>
            <div className='dropDown cardDD'>
                <h2>Cards</h2>
            {readyCards}
            </div>
            <div className='latexViewer'>
            {Object.keys(selectedCard).length ? <CardEditor deck={selectedDeck} setDeck={props.updateDecks} card={selectedCard} updateCards={retrieveCards}/> : <></>} 
            </div>
        </div>
    ) //Now we can toggle the card editor view
};

function CardEditor(props:any) {
    const belongedDeck = props.deck;
    const [cardFront,setCardFront] = useState(props.card.card_front);
    const [cardBack,setCardBack] = useState(props.card.card_back);

    useEffect(() => {
        setCardFront(props.card.card_front);
        setCardBack(props.card.card_back)
    },[props.card])

    const updateCard = async () => {
        props.setDeck(await window.electronAPI.updateCard(props.deck,cardFront,cardBack,props.card.card_ID));
        props.updateCards(belongedDeck); //all it took to update cards...
    }




    return (
        <>
            <LatexEditor title={"Card Front"} cardValueSetter={setCardFront} value={cardFront} />
            <LatexEditor title={"Card Back"} cardValueSetter={setCardBack} value={props.card.card_back} />
            <button className='changeButton' onClick={() => {
                updateCard();
            }}>Save Changes</button>
        </>
    )

};

export default ViewCards;