import AddSources from "../../components/sources/addSources/AddSources";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import DraggableMusic from "../../components/draggableMusic/DraggableMusic";
import '../../components/draggableMusic/DraggableMusic.css';
import spotifyControl from "../../functionality/spotifyControl";

const times = spotifyControl().times;

const ControlMusic = () => {

    const spotifyController = spotifyControl();
    const handleGoHome = () => {

    }

    return (
        <div>
            <GoHomeButton onGoHome={handleGoHome}/>
            <h2>Control music WIIHUUU</h2>

            <AddSources onAdd={(uri) => {
                spotifyControl().addSource(uri);
            }}/>

            <hr/>
            <DraggableMusic/>
            <DraggableMusic/>
            <DraggableMusic/>
            <div className='swimLane'>
                {
                    times.map((time) => (
                        <div className="hiddenBox">
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