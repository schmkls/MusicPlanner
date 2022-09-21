import AddSources from "../../components/sources/addSources/AddSources";
import spotifyControl from "../../functionality/spotifyControl";

const ControlMusic = () => {
    return (
        <div>
            <h2>Control music WIIHUUU</h2>
            <AddSources onAdd={(uri) => {
                spotifyControl().addSource(uri);
            }}/>
        </div>
    )
}

export default ControlMusic;