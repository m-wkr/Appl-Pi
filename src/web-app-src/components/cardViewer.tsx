import {useState, useEffect} from 'react';
import './cardViewer.css';
import LatexEditor from './latexEditor';

function ViewCards(props:any) {

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

    const [selectedCard, setSelectedCard] = useState({});

    const retrieveCards = (deck:string) => {
        window.electronAPI.retrieveDeckCards(deck).then(
            event => {
                setCards(event)
            }
        ) 

    }

    const readyDecks = Object.keys(props.decks).map(deck => {
        return <DeckUnit deck={deck} setSelectedDeck={setSelectedDeck} retrieveCards={retrieveCards} deleteDeck={deleteDeck}/>
    }
    ); 

    const readyCards = cards.map(card => {
        return <CardUnit card={card} setSelectedCard={setSelectedCard} retrieveCards={retrieveCards} deleteCard={deleteCard}/>
    }
    );


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


function DeckUnit(props:any) {
    const [visibility,setVisibility] = useState(false);


    return (<div className='readySet' key={props.deck}>
        <p 
        onClick={() => {props.setSelectedDeck(props.deck);props.retrieveCards(props.deck)}}
        onContextMenu={() => {setVisibility(!visibility)}}    
            >{props.deck}</p>
        {visibility ? <button className='deleteButton' onClick={() => props.deleteDeck(props.deck)}>DEL</button> : <></>}
    </div>)

}

function CardUnit(props:any) {
    const [visibility, setVisibility] = useState(false);


    return (<div className='readySet' key={props.card["card_ID"]}>
        <p 
        onClick={() => props.setSelectedCard(props.card)}
        onContextMenu={() => setVisibility(!visibility)}
        >{props.card["card_front"]}</p>
        {visibility ? <button className='deleteButton' onClick={() => {props.deleteCard(props.card["card_ID"]);props.retrieveCards(props.card["deck_name"]);props.setSelectedCard({})}}>DEL</button> : <></> }
    </div>)
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
        if (cardFront && cardBack) {
            props.setDeck(await window.electronAPI.updateCard(props.deck,cardFront,cardBack,props.card.card_ID));
            props.updateCards(belongedDeck); //all it took to update cards...
        }
    }




    return (
        <>
            <i><a target='_blank' href='https://katex.org/docs/supported.html'>See supported functions at katex.org</a></i>
            <LatexEditor title={"Card Front"} cardValueSetter={setCardFront} value={cardFront} />
            <LatexEditor title={"Card Back"} cardValueSetter={setCardBack} value={props.card.card_back} />
            <button className='changeButton' onClick={() => {
                updateCard();
            }}>Save Changes</button>
        </>
    )

};

export default ViewCards;