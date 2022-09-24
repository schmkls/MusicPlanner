import './DraggableMusic.css';
import {useEffect, useState} from 'react';
import Album from '../album/Album';
import {Rnd} from 'react-rnd';
import spotifyControl from '../../functionality/spotifyControl';

const DRAG_WIDTH = 1200;
const HEIGHT = 400;
const MARGINTOP = 400;

const times = spotifyControl().times;


//    <Album albumUri={"spotify:album:0urzz4PsqXHSYRIUmHeJom"}/>

/**
 * Album or playlist that is draggable so it represents a time span when it is scheduled. 
 */
const DraggableMusic = (props) => {

    const [left, setLeft] = useState(null);
    const [right, setRight] = useState(null);
    const [width, setWidth] = useState(null);

    const handleDragStop = (xVal) => {
        let val =   xVal > DRAG_WIDTH ? DRAG_WIDTH :
                    xVal < 0 ? 0 
                    : xVal;  

        setLeft(val);
        setRight(val + width);
    }

    const handleResizeStop = (xPos, width) => {
        setWidth(width);
    }


    useEffect(() => {

    }, [left, right]);

    return (
        <div>
            <div className="swimLane">
                <Rnd
                bounds='parent'
                default={{
                    x: 0,
                    y: 0,
                }}
                enableResizing={ {top:true, right:true, bottom:true, left:true, topRight:true, bottomRight:true, bottomLeft:true, topLeft:true }}
                dragAxis={ 'x' }
                onDragStop={(d) => { handleDragStop(d.x) }}
                onResizeStop={(e, direction, ref, delta, position) => { handleResizeStop(position, ref.style.width)}}
                >
                    <div className="background" >
                        <Album albumUri={"spotify:album:7rSZXXHHvIhF4yUFdaOCy9"} className="minimal"/>
                    </div>
                </Rnd>
                {
                    times.map((time) => (<div className="box"/>))
                }
            </div>
        </div>
        
    )
}

export default DraggableMusic;