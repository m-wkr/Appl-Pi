import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import '../index.css';
import "katex/dist/katex.min.css";


function App() {
    const [page,setPage] = useState("add");

    return (
        <>
            <NavigationBar />
            <div className='page-body'>
                {
                    page === "add" ?
                    <CardEditor /> :
                    <DecksViewer />
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
function DecksViewer() {
    const [decks, setDecks] = useState({});

    useEffect(() => {
        const ready = async () => {
            setDecks(await window.electronAPI.requestDecks());
        }
        ready();
    })
    
    const readyDecks = Object.keys(decks).map(i => <li>{i}</li>);

    return (
        <>
            <ul>
                {readyDecks}
            </ul>
        </>
    )
}



function CardEditor() {
    const [cardFront, setCardFront] = useState("");
    const [cardBack, setCardBack] = useState("");

    const addNewCard = () => {
        const addCard = async () => {
            await window.electronAPI.addNewCard("meowlrjghdhgk",cardFront,cardBack);
        }
        addCard();
        console.log("COMPLETE");
    }


    return (
        <>
            <LatexEditor title={'Card Front'} cardValueSetter={setCardFront} />
            <LatexEditor title={'Card Back'} cardValueSetter={setCardBack} />
            <button onClick={() => addNewCard()}>Create Card</button>
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