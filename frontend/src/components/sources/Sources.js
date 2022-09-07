
import Album from "../album/Album";
import Playlist from "../playlist/Playlist";
import AddSources from "../addSources/AddSources";
import { useState, useEffect } from "react";
import './Sources.css';
import spotifyControl from "../../functionality/spotifyControl";


const SourcesDisplay = (props) => {

    const [albumSources, setAlbumSources] = useState([]);
    const [playlistSources, setPlaylistSources] = useState([]);

    const addSource = (uri) => {
        spotifyControl().addSource(uri);
        const albumSrcs = JSON.parse(localStorage.getItem('ALBUM_SOURCES'));
        setAlbumSources(albumSrcs);
    }


    useEffect(() => {
        const playlistSources = JSON.parse(localStorage.getItem('PLAYLIST_SOURCES'));
        const albumSrcs = JSON.parse(localStorage.getItem('ALBUM_SOURCES'));
        setAlbumSources(albumSrcs);
        console.log("sources display sees albums: " + JSON.stringify(albumSrcs));
    }, []);


    return (
        <div className='sourcesContainer'>
            <AddSources addSource={addSource}/>
            Mix of music to come:
            {
                albumSources?.map((albumUri) => (
                    
                    <div className='smallAlbum'>
                        <Album albumUri={albumUri}/>
                    </div>

                    
                ))
            }
        </div>
    );
}


export default SourcesDisplay;