import './DraggableMusic.css';
import { useState} from 'react';
import MusicSource from '../musicSource/MusicSource';
import {Rnd} from 'react-rnd';
import spotifyControl from '../../functionality/spotifyControl';

const DRAG_WIDTH = 1200;    //equal to pixel width of the lanes
const DEFAULT_WIDTH = 1200 / 24;   //MusicSource


//    <Album albumUri={"spotify:album:0urzz4PsqXHSYRIUmHeJom"}/>

/**
 * Album or playlist that is draggable so it represents a time span when it is scheduled. 
 * 
 * @param props.uri uri of album or playlist
 */
const DraggableMusic = (props) => {

    const uri = props.uri;
    const spotifyController = spotifyControl();

    const [left, setLeft] = useState(props.left ? props.left : 0);
    const [right, setRight] = useState(props.right ? props.right : DEFAULT_WIDTH);
    const [width, setWidth] = useState(DEFAULT_WIDTH);

    const hourToX = (hr) => {
        let x = 0;
        let times = spotifyController.times;
        for (let i = 0; i < times.length; i++) {
            if (times[i] == Math.floor(hr)) {
                x += DEFAULT_WIDTH * i;
                x += hr - Math.floor(hr);
            }
        }   
        return x;
    }

    const xToHour = (x) => {
        const offset = x / (DRAG_WIDTH / 24);
        const hr = spotifyController.times[Math.floor(offset)];
        const rest = offset % 1; 
        return hr + rest;
    }

    const handleDragStop = (xVal) => {
        let val =   xVal > DRAG_WIDTH ? DRAG_WIDTH :
                    xVal < 0 ? 0 
                    : xVal;  
        
        console.log("drag stop to: " + val);
        const left = val;
        const right = val + width;
        setLeft(left);
        setRight(right); 
        props.onScheduling(props.uri, xToHour(left), xToHour(right));
    }

    const handleResizeStop = (pos, width) => {
        const widthVal = parseFloat(width.substring(0, width.length - 2));        
        const left = pos.x;
        const right = pos.x + widthVal;
        setWidth(widthVal);
        setLeft(left);
        setRight(right); 
        props.onScheduling(props.uri, xToHour(left), xToHour(right));
    }



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
                    x: hourToX(left),
                    y: 0,
                    width: hourToX(right) - hourToX(left)
                }}
                minWidth={DEFAULT_WIDTH}
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