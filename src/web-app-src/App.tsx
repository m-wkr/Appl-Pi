import { useEffect, useState } from 'react';
import '../index.css';
import ViewCards from './components/cardViewer';
import DecksViewer from './components/decksViewer';
import CardAppender from './components/cardAppender';

//to do, fix classnames to use same typing convention. camelCasing should be utilised

function NavigationBar(props:any) {

    return (
        <>
            <div className='testing-bg'></div>
            <div className='testing'></div>
            <header>
                <nav>
                    <a onClick={() => {props.pageSetter("deck");props.setLessonStart(false)}}>Decks</a>
                    <a onClick={() => props.pageSetter("add")}>Add</a>
                    <a onClick={() => props.pageSetter("view")}>View Cards</a>
                </nav>
            </header>
        </>
    )
};

function App() {
    const [page,setPage] = useState("tee");
    const [decks, setDecks] = useState({}); //decks need to be accessed by several sub pages, so we might as well keep the value in app
    const [lessonStart, setLessonStart] = useState(false);

    useEffect(() => {
        const ready = async () => {
            setDecks(await window.electronAPI.requestDecks());
        }
        ready();
    },[])


    return (
        <>
            <NavigationBar pageSetter={setPage} setLessonStart={setLessonStart}/>
            <div className='page-body'>
                {
                    page === "add" ? <CardAppender availableDecks={decks} updateDecks={setDecks} /> 
                    : page === "view" ? <ViewCards decks={decks} updateDecks={setDecks}/> 
                    :  <DecksViewer availableDecks={decks} updateDecks={setDecks} lessonStart={lessonStart} setLessonStart={setLessonStart}/>
                }
            </div>
        </>
    )

};

export default App