import ReactDOM from 'react-dom/client';
import navigate from './functionality/navigate';
import spotifyAccess from './functionality/spotifyAccess';
import SpotifyAuth from './pages/spotifyAuth/SpotifyAuth';
import spotifyControl from './functionality/spotifyControl';
import volumeControl from './functionality/volumeControl';
import tests from './functionality/tests/tests';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {

    tests().runTests();

    return;
    
    const navigator = navigate();
    const spotifyController = spotifyControl();
    const volumeController = volumeControl();
    const spotifyAccessor = spotifyAccess();
    const spotifyAccessToken = spotifyAccessor.getSpotifyAccessToken();
    
    
    if (!spotifyAccessToken) {
        console.log('No Spotify access token');
        return (
            <SpotifyAuth/>
        )
    }

    
    //start any background tasks that should run
    volumeController.controlVolume();
    spotifyController.controlMusic();
    
    return (
        <>
            {
                navigator.getElements().map((elem, index) => (
                    <div key={index}>
                        {elem}
                    </div>
                ))
            }
        </>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <App />
);