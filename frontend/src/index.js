import ReactDOM from 'react-dom/client';
import * as navigator from './functionality/navigate';
import * as spotifyAccessor from './functionality/spotifyAccess';
import SpotifyAuth from './pages/spotifyAuth/SpotifyAuth';
import * as spotifyController from './functionality/spotifyControl';
import * as volumeController from './functionality/volumeControl';
import tests from './functionality/tests/tests';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {

    
    const spotifyAccessToken = spotifyAccessor.getSpotifyAccessToken();
    
    if (!spotifyAccessToken) {
        console.log('No Spotify access token');
        return (
            <SpotifyAuth/>
        )
    }

    //OBS TESTS, COMMENT OUT    
    //tests().runTests();


    
    //start any background tasks that should run
    volumeController.controlVolume();
    spotifyController.controlMusic();
    
    return (
        <div>
            {
                navigator.getElements().map((elem, index) => (
                    <div key={index}>
                        {elem}
                    </div>
                ))
            }
        </div>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <App />
);