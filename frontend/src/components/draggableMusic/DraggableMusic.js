import './DraggableMusic.css';
import {useEffect, useState} from 'react';
import MusicSource from '../musicSource/MusicSource';
import {Rnd} from 'react-rnd';
import spotifyControl from '../../functionality/spotifyControl';

const DRAG_WIDTH = 1200;    //should correspond to width of the lanes in CSS


//    <Album albumUri={"spotify:album:0urzz4PsqXHSYRIUmHeJom"}/>

/**
 * Album or playlist that is draggable so it represents a time span when it is scheduled. 
 * 
 * @param props.uri uri of album or playlist
 */
const DraggableMusic = (props) => {

    const spotifyController = spotifyControl();
    const times = spotifyController.times;

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
                enableResizing={ {top:false, right:true, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                dragAxis={ 'x' }
                onDragStop={(d) => { handleDragStop(d.x) }}
                onResizeStop={(e, direction, ref, delta, position) => { handleResizeStop(position, ref.style.width)}}
                >
                    <div className="background" >
                        <MusicSource uri={props.uri} minimal={true} closeable={true} onClose={() => props.onRemove(props.uri)}/>
                    </div>
                </Rnd>
                {
                    times.map((time) => (<div className="box" key={time}/>))
                }
            </div>
        </div>
        
    )
}

export default DraggableMusic;