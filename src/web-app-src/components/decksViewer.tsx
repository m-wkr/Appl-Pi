import {useState,useEffect} from 'react';

//TBC
function DecksViewer(props:any) {
    const [selectedDeck,setSelectedDeck] = useState("");
    const readyDecks = Object.keys(props.availableDecks).map(i => <li onClick={() => {setSelectedDeck(i);props.setLessonStart(true)}}>{i}</li>);

    return (
        props.lessonStart ? <LessonSpace deckName={selectedDeck} returnFunction={props.setLessonStart} updateDecks={props.updateDecks}/> 
        : 
            <ul>
                {readyDecks}
            </ul>
    )
};

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