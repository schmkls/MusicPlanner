import AddSources from "../../components/sources/addSources/AddSources";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import spotifyControl from "../../functionality/spotifyControl";

const ControlMusic = () => {

    const handleGoHome = () => {

    }


    return (
        <div>
            <GoHomeButton onGoHome={handleGoHome}/>
            <h2>Control music WIIHUUU</h2>
            <AddSources onAdd={(uri) => {
                spotifyControl().addSource(uri);
            }}/>
        </div>
    )
}

export default ControlMusic;