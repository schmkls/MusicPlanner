import './DraggableMusic.css';
import { useEffect, useState} from 'react';
import MusicSource from '../musicSource/MusicSource';
import {Rnd} from 'react-rnd';
import * as musicScheduler from '../../functionality/musicScheduling';

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

    const [left, setLeft] = useState(props.left ? props.left : 0);
    const [right, setRight] = useState(props.right ? props.right : 2);

    /* calculate width in pixels for time span between left and right time */
    const calcWidth = () => {
        if (!props.right && props.left) return DEFAULT_WIDTH;
        if (right < left) {
            return (24 - left + right) * DEFAULT_WIDTH;
        } 

        return (right - left) * DEFAULT_WIDTH;

    }

    //width in pixels 
    const [width, setWidth] = useState(calcWidth());

    

    const hourToX = (hr) => {
        let x = 0;
        let times = musicScheduler.times;
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
        const hr = musicScheduler.times[Math.floor(offset) % musicScheduler.times.length];
        const rest = offset % 1; 
        return hr + rest;
    }

    const handleDragStop = (xVal) => {
        let val =   xVal > DRAG_WIDTH ? DRAG_WIDTH :
                    xVal < 0 ? 0 
                    : xVal;  
        
        const left = val;
        const right = val + width;
        setLeft(left);
        setRight(right); 

        console.log("rescheduling. start time = ", xToHour(left), " end time = ", xToHour(right));
        props.onScheduling(props.uri, xToHour(left), xToHour(right), props.id);
    }


    const handleResizeStop = (pos, width) => {
        const widthVal = parseFloat(width.substring(0, width.length - 2));       
        console.log('widthVal: ', widthVal); 
        const left = pos.x;
        const right = pos.x + widthVal;
        setWidth(widthVal);
        setLeft(left);
        setRight(right); 
        console.log("rescheduling. start time = ", xToHour(left), " end time = ", xToHour(right));
        props.onScheduling(props.uri, xToHour(left), xToHour(right), props.id);
    }

    useEffect(() => {
        console.log('new width: ', width);
    }, [width])

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
                    width: width
                }}
                minWidth={DEFAULT_WIDTH}
                enableResizing={ {top:false, right:true, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                dragAxis={ 'x' }
                onDragStop={(e, ref) => handleDragStop(ref.x)}
                onResizeStop={(e, direction, ref, delta, position) => { handleResizeStop(position, ref.style.width)}}
                >
                    <div className="background" >
                        <MusicSource uri={props.uri} minimal={true} closeable={true} onClose={() => props.onRemove(props.id)}/>
                    </div>
                </Rnd>
                {
                    musicScheduler.times.map((time) => (<div className="box" key={time}/>))
                }
            </div>
        </div>
        
    )
}

export default DraggableMusic;