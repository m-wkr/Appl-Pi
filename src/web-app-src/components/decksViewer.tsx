import {useState,useEffect} from 'react';

//TBC
function DecksViewer(props:any) {
    const [selectedDeck,setSelectedDeck] = useState("");
    const decks = props.availableDecks;
    const [readyDecks,setReadyDecks] = useState([]);

    useEffect(() => {
        setReadyDecks(Object.keys(decks).map(deck => <DeckRepresentative deckName={deck} setSelectedDeck={setSelectedDeck} setLessonStart={props.setLessonStart}/>))
    },[decks])


    return (
        props.lessonStart ? <LessonSpace deckName={selectedDeck} returnFunction={props.setLessonStart} updateDecks={props.updateDecks}/> 
        : 
            <ul>
                {readyDecks}
            </ul>
    )
};

function DeckRepresentative(props:any) {
    const deckName = props.deckName;
    const [rowNum, setRowNum] = useState(0);

    useEffect(() => {
        window.electronAPI.returnCardCount(deckName).then(value => {
            setRowNum(value);
        })
    },[])

    if (rowNum) {
        return (
            <li onClick={() => {
                props.setSelectedDeck(deckName);
                props.setLessonStart(true);
            }}>{props.deckName}</li>
        )
    } else {
        return (
            <li>{props.deckName}</li>
        )
    }
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
};

export default DecksViewer;