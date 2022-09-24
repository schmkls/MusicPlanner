import './DraggableMusic.css';
import {useEffect, useState} from 'react';
import Draggable from 'react-draggable';
import Album from '../album/Album';

const DRAG_WIDTH = 1200;

/**
 * Album or playlist that is draggable so it represents a time span when it is scheduled. 
 */
const DraggableMusic = () => {

    const [outerVal, setOuterVal] = useState();

    const handleChangeOuter = (val) => {
        setOuterVal(val);
        
    }

    useEffect(() => {
        console.log("outer val: " + outerVal);
    }, [outerVal]);


    const handleDragStop = (xVal) => {
        let val =   xVal > DRAG_WIDTH ? DRAG_WIDTH :
                    xVal < 0 ? 0 
                    : xVal;  

        console.log("dragged to: " + val);
        setOuterVal(val);
    }

    return (
        <div className="outer">
            <Draggable
                bounds={{left: 0, right: 1200}}
                axis="x"
                handle=".handle"
                defaultPosition={{x: 0, y: 0}}
                position={null}
                grid={[25, 25]}
                scale={1}
                onStart={() => {}}
                onDrag={() => {}}
                onStop={(e) => {handleDragStop(e.clientX)}}>
                <div>
                    <div className="handle">
                        <div className='albumContainer'>
                            <Album albumUri={"spotify:album:0urzz4PsqXHSYRIUmHeJom"}/>
                        </div>
                    </div>
                </div>
            </Draggable>
        </div>
    )
}

export default DraggableMusic;