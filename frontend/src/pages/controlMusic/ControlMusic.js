import AddSources from "../../components/sources/addSources/AddSources";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import DraggableMusic from "../../components/draggableMusic/DraggableMusic";
import '../../components/draggableMusic/DraggableMusic.css';
import spotifyControl from "../../functionality/spotifyControl";
import { useState } from "react";

const times = spotifyControl().times;

const ControlMusic = () => {

    const spotifyController = spotifyControl();
    const [uris, setUris] = useState([]);

    const handleGoHome = () => {

    }

    return (
        <div>
            <GoHomeButton onGoHome={handleGoHome}/>
            <h2>Control music WIIHUUU</h2>

            <AddSources onAdd={(uri) => {
                setUris(uris => [...uris, uri]);
            }}/>
            <hr/>
            {
                uris.map((uri) => (
                    <DraggableMusic uri={uri} key={uri}/>
                ))
            }
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
        </div>
    )
}

export default ControlMusic;