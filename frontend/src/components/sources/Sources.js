
import Album from "../album/Album";
import Playlist from "../playlist/Playlist";
import AddSources from "../addSources/AddSources";
import { useState, useEffect } from "react";
import './Sources.css';
import spotifyControl from "../../functionality/spotifyControl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'


const SourcesDisplay = (props) => {

    const [albumSources, setAlbumSources] = useState([]);
    const [playlistSources, setPlaylistSources] = useState([]);

    const getSources = () => {
        const playlistSrcs = JSON.parse(localStorage.getItem('PLAYLIST_SOURCES'));
        const albumSrcs = JSON.parse(localStorage.getItem('ALBUM_SOURCES'));
        setAlbumSources(albumSrcs);
        setPlaylistSources(playlistSrcs);
    }

    const addSource = (uri) => {
        spotifyControl().addSource(uri);
        getSources();
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
            <AddSources addSource={addSource}/>
            Mix of music to come:
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