import './DraggableMusic.css';
import {useEffect, useState} from 'react';
import MusicSource from '../musicSource/MusicSource';
import {Rnd} from 'react-rnd';
import spotifyControl from '../../functionality/spotifyControl';

const DRAG_WIDTH = 1200;    //equal to pixel width of the lanes
const DEFAULT_WIDTH = 50;   //equal to width of MusicSource


//    <Album albumUri={"spotify:album:0urzz4PsqXHSYRIUmHeJom"}/>

/**
 * Album or playlist that is draggable so it represents a time span when it is scheduled. 
 * 
 * @param props.uri uri of album or playlist
 */
const DraggableMusic = (props) => {

    const spotifyController = spotifyControl();

    const [left, setLeft] = useState(null);
    const [right, setRight] = useState(null);
    const [width, setWidth] = useState(DEFAULT_WIDTH);

    const translateToHour = (x) => {
        const offset = x / (DRAG_WIDTH / 24);
        const hr = spotifyController.times[Math.floor(offset)];
        const rest = offset % 1; 
        console.log('hr+rest:', hr+rest);
        return hr+rest;
    }

    const handleDragStop = (xVal) => {
        let val =   xVal > DRAG_WIDTH ? DRAG_WIDTH :
                    xVal < 0 ? 0 
                    : xVal;  
        
        console.log("drag stop to: " + val);

        setLeft(val);
        setRight(val + width); 
    }

    const handleResizeStop = (xPos, width) => {
        const widthVal = parseFloat(width.substring(0, width.length - 2));        
        setWidth(widthVal);
        setLeft(xPos.x);
        setRight(xPos.x + widthVal); 
    }


    useEffect(() => {
        props.onChange(props.uri, translateToHour(left), translateToHour(right));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [left, right, width]);


    if (!props.uri) {
        console.error("No uri provided");
        return <h2>Error</h2>
    }

    return (
        <div>
            <div className="swimLane">
                <Rnd
                bounds='parent'
                default={{
                    x: 0,
                    y: 0,
                }}
                minWidth='50px'
                enableResizing={ {top:false, right:true, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                dragAxis={ 'x' }
                onDragStop={(e, ref) => handleDragStop(ref.x)}
                onResizeStop={(e, direction, ref, delta, position) => { handleResizeStop(position, ref.style.width)}}
                >
                    <div className="background" >
                        <MusicSource uri={props.uri} minimal={true} closeable={true} onClose={() => props.onRemove(props.uri)}/>
                    </div>
                </Rnd>
                {
                    spotifyController.times.map((time) => (<div className="box" key={time}/>))
                }
            </div>
        </div>
        
    )
}

export default DraggableMusic;