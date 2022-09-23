import './DraggableMusic.css';
import {useEffect, useState} from 'react';
import Draggable from 'react-draggable';
import Album from '../album/Album';

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
        console.log("stop val: " + JSON.stringify(xVal));
    }

    return (
        <div>
             <input 
                val={outerVal}
                type="range" 
                min="0" 
                max="100" 
                className={ 'outer' }
                onChange={(e) => handleChangeOuter(e.target.value)}
            />

            <Draggable
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
                        <div className='albumContainer' style={{width: '100px'}}>
                            <Album albumUri={"spotify:album:0urzz4PsqXHSYRIUmHeJom"}/>
                        </div>
                    </div>
                    
                </div>
            </Draggable>
        </div>
    )
}

export default DraggableMusic;