import {useState, useEffect} from 'react';
import LatexEditor from './latexEditor';

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
            <button onClick={() => {
                updateCard();
            }}></button>
        </>
    )

};

export default ViewCards;