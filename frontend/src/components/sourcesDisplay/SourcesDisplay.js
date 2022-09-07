
import Album from "../album/Album";
import Playlist from "../playlist/Playlist";
import { useState, useEffect } from "react";

const SourcesDisplay = () => {

    const [albumSources, setAlbumSources] = useState([]);
    const [playlistSources, setPlaylistSources] = useState([]);


    useEffect(() => {
        const playlistSources = JSON.parse(localStorage.getItem('PLAYLIST_SOURCES'));
        const albumSrcs = JSON.parse(localStorage.getItem('ALBUM_SOURCES'));
        setAlbumSources(albumSrcs);
        console.log("sources display sees albums: " + JSON.stringify(albumSrcs));
    }, []);


    return (
        <div>
            {
                albumSources?.map((albumUri) => {
                    <Album albumUri={albumUri}/>
                })
            }
            <h2>Sources display</h2>
        </div>
    );
}


export default SourcesDisplay;