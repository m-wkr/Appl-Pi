import katex from 'katex';
import "katex/dist/katex.min.css";
import { useState, useRef, useEffect} from 'react';

function LatexEditor(props:any) {
    const [inputValue, setInputValue] = useState(props.value);
    const ref = useRef(null);

    // Render katex string
    useEffect(() => {
        katex.render(String.raw`${inputValue}`,ref.current, {throwOnError: false,displayMode:true});
    },[inputValue]);

    //MASSIVE NOTES, you can have multiple useEffects, and you can list dependencies so that when those values update, it'll run the effect :D
    useEffect(() => {
        setInputValue(props.value)
    },[props.value])

    

    return (
        <>
            <div className='latex-editor'>
                <h3 className='title'>{props.title}</h3>
                <div ref={ref}></div>
                <textarea  value={inputValue} onChange={event => { 
                    setInputValue(event.target.value);
                    props.cardValueSetter(event.target.value);
                    katex.render(String.raw`${inputValue}`,ref.current, {throwOnError:false,displayMode:true})
                }} />
            </div>
        </>
    )
};

export default LatexEditor;