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
    return (
        <>
            <ul>
                <li>test</li>
                <li>test2</li>
            </ul>
        </>
    )
}



function CardEditor() {
    return (
        <>
            <LatexEditor title={'Card Front'}/>
            <LatexEditor title={'Card Back'}/>
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
                    katex.render(String.raw`${inputValue}`,ref.current, {throwOnError:false})
                }} />
            </div>
        </>
    )
}


export default App