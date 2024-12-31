import katex from 'katex';
import "katex/dist/katex.min.css";
import {useRef, useEffect} from 'react';


function LatexViewer(props:any) {
    const ref = useRef(null);

    useEffect(() => {
        katex.render(String.raw`${props.value}`,ref.current, {throwOnError: false,displayMode:true});
    },[props.value]);


    return (
        <div className='latexEditor'>
            <h3 className='title'>{props.title}</h3>
            <div className='latexDisplay' ref={ref}></div>
        </div>
    )
}

export default LatexViewer;