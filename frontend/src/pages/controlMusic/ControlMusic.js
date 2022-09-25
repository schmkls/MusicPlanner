import AddSources from "../../components/sources/addSources/AddSources";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import DraggableMusic from "../../components/draggableMusic/DraggableMusic";
import '../../components/draggableMusic/DraggableMusic.css';
import spotifyControl from "../../functionality/spotifyControl";
import { useEffect, useState } from "react";

const times = spotifyControl().times;

const ControlMusic = () => {

    const spotifyController = spotifyControl();
    const [scheduled, setScheduled] = useState([]);

    const handleGoHome = async() => {
        return new Promise((res, rej) => {
            for (let i = 0; i < scheduled.length; i++) {
                spotifyController.scheduleMusic(scheduled[i][0], scheduled[i][1], scheduled[i][2]);
            }
    
            return res();
        });
        
    }

    const handleChange = (uri, start, end) => {
        console.log("HANDLING CHANGE");
        let temp = Array.from(scheduled);

        for (let i = 0; i < temp.length; i++) {
            if (temp[i][0] === uri) {
                temp[i] = [uri, start, end];
                setScheduled(temp);
                return;
            } 
        }

        temp.push([uri, start, end]);
    }

    const handleRemove = (uri) => {
        console.log("handling remove of: ", uri);
        let temp = Array.from(scheduled);
        let index = -1;
        for (let i = 0; i < temp.length; i++) {
            if (temp[i][0] === uri) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            temp.splice(index, 1);
        }
        setScheduled(temp);
    }

    useEffect(() => {
        console.log("scheduled changed: ", JSON.stringify(scheduled, null, 2));
    }, [scheduled])

    return (
        <div>
            <GoHomeButton onGoHome={handleGoHome}/>
            <h2>Add and schedule sources of music</h2>
            <AddSources onAdd={(uri) => {
                setScheduled(scheduled => [...scheduled, [uri, null, null]]);
            }}/>
            <hr/>
            {
                scheduled.map((scheduled, index) => (
                    <DraggableMusic 
                    onChange={(uri, start, end) => handleChange(uri, start, end)} 
                    onRemove={(uri) => handleRemove(uri)} 
                    uri={scheduled[0]} 
                    key={index}/>
                ))
            }
            {
                scheduled.length > 0 ?
                    <div className='swimLane'>
                    {
                        times.map((time) => (
                            <div className="hiddenBox" key={time}>
                                {
                                    time.toString().length === 1 ? 
                                        "0" + time + ":00"
                                    :
                                        time + ":00"
                                }
                            </div>
                        ))
                    }
                    </div>
                :
                <></>
            }
            
        </div>
    )
}

export default ControlMusic;