import AddSources from "../../components/sources/addSources/AddSources";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import DraggableMusic from "../../components/draggableMusic/DraggableMusic";
import '../../components/draggableMusic/DraggableMusic.css';
import spotifyControl from "../../functionality/spotifyControl";
import { useEffect, useState } from "react";

const times = spotifyControl().times;

const ControlMusic = () => {

    const spotifyController = spotifyControl();
    const [uris, setUris] = useState([]);

    const handleGoHome = () => {

    }

    const handleChange = () => {

    }

    const handleRemove = (uri) => {
        console.log("handling remove of: ", uri);
        let temp = Array.from(uris);
        var index = temp.indexOf(uri);
        if (index !== -1) {
            temp.splice(index, 1);
        }
        setUris(temp);
    }

    useEffect(() => {
        console.log("uris changed: ", uris);
    }, [uris])

    return (
        <div>
            <GoHomeButton onGoHome={handleGoHome}/>
            <h2>Add and schedule sources of music</h2>
            <AddSources onAdd={(uri) => {
                setUris(uris => [...uris, uri]);
            }}/>
            <hr/>
            {
                uris.map((uri) => (
                    <DraggableMusic onChange={() => handleChange()} onRemove={(uri) => handleRemove(uri)} uri={uri} key={uri}/>
                ))
            }
            {
                uris.length > 0 ?
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