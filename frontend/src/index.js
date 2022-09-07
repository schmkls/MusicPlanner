import ReactDOM from 'react-dom/client';
import navigate from './functionality/navigate';
import spotifyAccess from './functionality/spotifyAccess';
import SpotifyAuth from './pages/spotifyAuth/SpotifyAuth';
import spotifyControl from './functionality/spotifyControl';
import volumeControl from './functionality/volumeControl';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
    
    const navigator = navigate();
    const spotifyController = spotifyControl();
    const volumeController = volumeControl();
    const spotifyAccessor = spotifyAccess();
    const spotifyAccessToken = spotifyAccessor.getSpotifyAccessToken();
    

    //start any background tasks that should run
    volumeController.controlVolume();

    
    if (!spotifyAccessToken) {
        return (
            <SpotifyAuth/>
        )
    }

    
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