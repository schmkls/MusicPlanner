import axios from "axios";
import React, { useEffect, useState } from "react";
import Track from "../track/Track";
import Playlist from "../playlist/Playlist";
import Album from "../album/Album";
import spotifyAccess from "../../functionality/spotifyAccess";


const UPDATE_INTERVAL = 2000000;  //20 seconds

/**
 * Display currently playing track
 */
const Playing = () => {

    const [currPlaying, setCp] = useState(null);
    const [playlist, setPlaylist] = useState(null);
    const [album, setAlbum] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const spotifyAccessor = spotifyAccess();

    const getPlayingData = () => {
        const accessToken = spotifyAccessor.getSpotifyAccessToken();

        axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("get currently playing track bad response");
                return;
            }

            console.log("currently playing response: " + JSON.stringify(response, null, 2));

            if (!response.data.item || !response.data.item.id) {
                setCp(null);
                return;
            }

            console.log("context: " + JSON.stringify(response.data.context, null, 2));
            
            if (response.data.context.type == 'playlist') {
                setPlaylist(response.data.context.uri);
            }   

            if (response.data.context.type == 'album') {
                setAlbum(response.data.context.uri);
            }

            setCp(response.data.item.id);
            setIsPlaying(response.data.is_playing);
        })
        .catch((err) => {
            console.log("get currently playing track error: " + err);
        });

        setTimeout(() => {
            setCp(null);
            setPlaylist(null);
            setAlbum(null);
        }, UPDATE_INTERVAL);
    }


    getPlayingData();


    useEffect(() => {
        getPlayingData();
    }, [currPlaying]);



    return (
        <div>
            <hr/>
            <h2>Currently playing: </h2>
            {
                isPlaying ? 
                    <></>
                :
                    <p>(paused)</p>

            }
            {
                currPlaying != null ? 
                    <Track trackId={currPlaying}/>
                :
                    <p>loading...</p>
            }
            {
                album != null ?
                    <>
                        <p> on </p>
                        <Album albumUri={album}/>
                    </>
                    
                :
                    <></>

            }
            {
                playlist != null ?
                    <>
                        <p> on </p>
                        <Playlist playlistUri={playlist}/>
                    </>
                :
                    <></>

            }
            <hr/>
        </div>
    )
}

export default Playing;