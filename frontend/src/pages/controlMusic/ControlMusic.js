import AddSources from "../../components/sources/addSources/AddSources";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import DraggableMusic from "../../components/draggableMusic/DraggableMusic";
import '../../components/draggableMusic/DraggableMusic.css';
import spotifyControl from "../../functionality/spotifyControl";
import { useEffect, useState } from "react";

const times = spotifyControl().times;

const ControlMusic = () => {

    const spotifyController = spotifyControl();
    const alreadyScheduled = spotifyController.getScheduledMusic();
    const [scheduled, setScheduled] = useState(alreadyScheduled);

    const handleGoHome = async() => {
        return new Promise((res, rej) => {
            for (let i = 0; i < scheduled.length; i++) {
                console.log("when going home, scheduled.length = " + scheduled.length);
                spotifyController.scheduleMusic(scheduled[i][0], scheduled[i][1], scheduled[i][2]);
            }
    
            return res();
        });
        
    }


    const handleScheduling = (uri, start, end) => {
        console.log("HANDLING CHANGE");
        let temp = Array.from(scheduled);

        for (let i = 0; i < temp.length; i++) {
            if (temp[i][0] === uri) {
                temp[i] = [uri, start, end];
                console.log("rescheduling existing music");
                setScheduled(temp);
                return;
            } 
        }

        console.log("scheduling new music");
        temp.push([uri, start, end]);
        setScheduled(temp);
    }

    
    const handleRemove = (uri) => {
        spotifyController.unSchedule(uri);

        let temp = Array.from(scheduled);
        console.log("handling remove of: ", uri);
        temp = temp.filter( function(sch) {
            return sch[0] !== uri;
        });

        setScheduled(temp);
    }

    useEffect(() => {
        console.log("scheduled changed: ", scheduled);
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
                    uri={scheduled[0]} 
                    left={scheduled[1]}
                    right={scheduled[2]}
                    onScheduling={(uri, start, end) => handleScheduling(uri, start, end)} 
                    onRemove={(uri) => handleRemove(uri)} 
                    key={scheduled[0] + index}/>
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