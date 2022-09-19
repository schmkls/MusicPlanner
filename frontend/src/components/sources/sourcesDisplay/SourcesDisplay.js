import Album from "../../album/Album";
import Playlist from "../../playlist/Playlist";
import AddSources from "../addSources/AddSources";
import { useState, useEffect } from "react";
import './SourcesDisplay.css';
import spotifyControl from "../../../functionality/spotifyControl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'


const SourcesDisplay = () => {

    const [albumSources, setAlbumSources] = useState([]);
    const [playlistSources, setPlaylistSources] = useState([]);

    const getSources = () => {
        const playlistSrcs = JSON.parse(localStorage.getItem('SOURCES_PLAYLISTS'));
        const albumSrcs = JSON.parse(localStorage.getItem('SOURCES_ALBUMS'));
        setAlbumSources(albumSrcs);
        setPlaylistSources(playlistSrcs);
    }

    
    const deleteSource = (uri) => {
        spotifyControl().deleteSource(uri);
        getSources();
    }

    useEffect(() => {
        getSources();
    }, []);


    return (
        <div>
            <div className='sourcesGrid'>
            {
                albumSources?.map((albumUri, index) => (
                    <div className='sourceDisplayed' key={index}>
                        <Album albumUri={albumUri}/>
                        <button onClick={() => deleteSource(albumUri)}>
                            <FontAwesomeIcon icon={faMinusCircle}/>
                        </button>
                    </div>
                ))
            }
             {
                playlistSources?.map((playlistUri, index) => (
                    <div className='sourceDisplayed' key={index}>
                        <Playlist playlistUri={playlistUri}/>
                        <button onClick={() => deleteSource(playlistUri)}>
                            <FontAwesomeIcon icon={faMinusCircle}/>
                        </button>
                    </div>
                ))
            }
            </div>
        </div>
    );
}


export default SourcesDisplay;