import {useState,useEffect} from 'react';
import './decksViewer.css';
import LatexViewer from './latexViewer';

//TBC
function DecksViewer(props:any) {
    const [selectedDeck,setSelectedDeck] = useState("");
    const decks = props.availableDecks;
    const [readyDecks,setReadyDecks] = useState([]);

    useEffect(() => {
        setReadyDecks(Object.keys(decks).map(deck => <DeckRepresentative key={deck} deckName={deck} setSelectedDeck={setSelectedDeck} setLessonStart={props.setLessonStart}/>))
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
    const date = new Date().toISOString().split("T")[0];
    const deckName = props.deckName;
    const [rowNum, setRowNum] = useState(0);

    useEffect(() => {
        window.electronAPI.returnCardCount(deckName,date).then(value => {
            setRowNum(value);
        })
    },[])

    if (rowNum) {
        return (
            <li onClick={() => {
                props.setSelectedDeck(deckName);
                props.setLessonStart(true);
            }}>{props.deckName} <span>{rowNum} card/s due</span></li>
        )
    } else {
        return (
            <li>{props.deckName} <span>0 cards due</span></li>
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
        setCardsQueue(cardsQueue.splice(1));
    };

    function resetCardProgress() {
        cardsQueue[0].days_until_review = 0;
        window.electronAPI.updateCardDueTime(props.deckName,cardsQueue[0].card_ID,cardsQueue[0].last_studied_time,0);
    }

    function enqueueCardToBack() {
        const currentCard = cardsQueue[0];
        setCardsQueue([...cardsQueue.splice(1),currentCard]);
    }

    if (cardsQueue.length) {
        if (isFront) {
            return (<div className='lessonSpace'>
                <LatexViewer value={cardFront} title='Card Front'/>
                <div className='buttons'>
                    <button onClick={() => setIsFront(false)}>Show Answer</button>
                </div>
            </div>)
        } else {
            return (<div className='lessonSpace'>
                <LatexViewer value={cardBack} title='Card Back' />
                <div className='buttons'>
                    <button onClick={() => {resetCardProgress();enqueueCardToBack();setIsFront(true)}}>Try Again</button>
                    <LessonSpaceButton 
                        currentCard={cardsQueue[0]}
                        timeMultiplier={1}
                        cardsQueueLength={cardsQueue.length}
                        currentDate={currentDate}

                        completeCard={completeCard}
                        setIsFront={setIsFront}
                        returnFunction={props.returnFunction}
                        updateDecks={props.updateDecks}
                    />
                    <LessonSpaceButton 
                        currentCard={cardsQueue[0]}
                        timeMultiplier={2}
                        cardsQueueLength={cardsQueue.length}
                        currentDate={currentDate}

                        completeCard={completeCard}
                        setIsFront={setIsFront}
                        returnFunction={props.returnFunction}
                        updateDecks={props.updateDecks}
                    />
                    <LessonSpaceButton 
                        currentCard={cardsQueue[0]}
                        timeMultiplier={4}
                        cardsQueueLength={cardsQueue.length}
                        currentDate={currentDate}

                        completeCard={completeCard}
                        setIsFront={setIsFront}
                        returnFunction={props.returnFunction}
                        updateDecks={props.updateDecks}
                    />
                </div>
            </div>)
        }
    }
};

function LessonSpaceButton(props:any) {
    const currentCard = props.currentCard;
    const timeMultiplier = props.timeMultiplier;
    const cardDaysUntilReviewInterval = (currentCard.days_until_review + 1) * timeMultiplier;


    return (
        <button onClick={() => {
            if (props.cardsQueueLength > 1) { 
                props.completeCard();
                props.setIsFront(true) 
            } else {
                props.returnFunction(false);
            }
            window.electronAPI.updateCardDueTime(props.deckName,currentCard.card_ID,props.currentDate,cardDaysUntilReviewInterval).then(value =>{
                props.currentCard.days_until_review = 0;
            })

        }}>{cardDaysUntilReviewInterval} Days</button>
    )
};
    
export default DecksViewer;