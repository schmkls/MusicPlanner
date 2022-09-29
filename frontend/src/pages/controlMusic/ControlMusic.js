import AddSources from "../../components/sources/addSources/AddSources";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import DraggableMusic from "../../components/draggableMusic/DraggableMusic";
import '../../components/draggableMusic/DraggableMusic.css';
import musicScheduling from "../../functionality/musicScheduling";
import { useEffect, useState } from "react";

const times = musicScheduling().times;


/**
 * Page for scheduling music. 
 */
const ControlMusic = () => {

    const musicScheduler = musicScheduling();

    const alreadyScheduled = musicScheduler.getScheduledMusic();
    const [scheduled, setScheduled] = useState(alreadyScheduled);   //(each element contains: uri, start, end, uniqueId)

    const handleGoHome = async() => {
        return new Promise((res, rej) => {
            for (let i = 0; i < scheduled.length; i++) {
                console.log("when going home, scheduled.length = " + scheduled.length);
                musicScheduler.scheduleMusic(scheduled[i][0], scheduled[i][1], scheduled[i][2], scheduled[i][3]);
            }
    
            return res();
        });
        
    }


    const handleScheduling = async(uri, start, end, id) => {
        console.log("HANDLING CHANGE");
        let temp = Array.from(scheduled);

        for (let i = 0; i < temp.length; i++) {
            if (temp[i][3] === id) {
                temp[i] = [uri, start, end, id];
                console.log("rescheduling existing music");
                setScheduled(temp);
                return;
            }  
        }

        console.error('Could not find music to schedule');
    }

    
    const handleRemove = (id) => {
        let temp = Array.from(scheduled);
        temp = temp.filter(function(sch) {
            return sch[3] !== id;
        }) 

        setScheduled(temp);
        musicScheduler.unSchedule(id);
    }

    useEffect(() => {
        console.log("scheduled changed: ", scheduled);
    }, [scheduled])


    return (
        <div>
            <GoHomeButton onGoHome={handleGoHome}/>
            <h2>Add and schedule sources of music</h2>
            <AddSources onAdd={(uri) => {
                let uniqueId = musicScheduler.makeUniqueId(uri);
                setScheduled(scheduled => [...scheduled, [uri, null, null, uniqueId]]);
            }}/>
            <hr/>
            {
                scheduled.map((scheduled) => (
                    <DraggableMusic 
                    uri={scheduled[0]} 
                    left={scheduled[1]}
                    right={scheduled[2]}
                    onScheduling={(uri, start, end, id) => handleScheduling(uri, start, end, id)} 
                    onRemove={(id) => handleRemove(id)} 
                    key={scheduled[3]}
                    id={scheduled[3]}
                    />
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