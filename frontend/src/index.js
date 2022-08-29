import ReactDOM from 'react-dom/client';
import navigate from './functionality/navigate';
import spotifyAccess from './functionality/spotifyAccess';

export default function App() {

    const navigator = navigate();
    const spotifyAccessor = spotifyAccess();
    const spotifyAccessToken = spotifyAccessor.getSpotifyAccessToken();

    if (!spotifyAccessToken) {
        return (
            <h2>inte inloggad</h2>
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