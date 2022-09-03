import ReactDOM from 'react-dom/client';
import navigate from './functionality/navigate';
import spotifyAccess from './functionality/spotifyAccess';
import SpotifyAuth from './pages/spotifyAuth/SpotifyAuth';

export default function App() {
    
    const navigator = navigate();
    const spotifyAccessor = spotifyAccess();
    const spotifyAccessToken = spotifyAccessor.getSpotifyAccessToken();
    
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