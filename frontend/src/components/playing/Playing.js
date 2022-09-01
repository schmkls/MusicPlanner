import axios from "axios";
import React, { useEffect, useState } from "react";
import Track from "../track/Track";
import Playlist from "../playlist/Playlist";
import Album from "../album/Album";
import spotifyAccess from "../../functionality/spotifyAccess";


const UPDATE_INTERVAL = 10000;  //10 seconds

/**
 * Display currently playing track
 */
const Playing = () => {

    const [currPlaying, setCp] = useState(null);    //currently playing track
    const [playlist, setPlaylist] = useState(null);
    const [album, setAlbum] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true); //true if playing, false if paused
    const [episode, setEpisode] = useState(false);  //true if episode being played
    const [warning, setWarning] = useState(null);

    const spotifyAccessor = spotifyAccess();

    //todo: handle when not playing on album or playlist, for example wh e spotfu syggs
    const getPlayingData = () => {
        const accessToken = spotifyAccessor.getSpotifyAccessToken();

        axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("get currently playing track bad response");
                return;
            }

            //console.log(JSON.stringify(response, null, 2));

            setIsPlaying(response.data.is_playing);
            if (response.data.currently_playing_type == 'episode') {
                setEpisode(true);
                setCp(null);
                return;
            }

            if (response.data.context == null) {
                setCp(response.data.item.id);

                //if tempo or popularity filtering active
                    setWarning("Play from an album or playlist in order for tempo and/or popularity filtering to work");
                return;
            }

            setWarning(null);
            
            if (response.data.context.type == 'playlist') {
                setPlaylist(response.data.context.uri);
            }   

            if (response.data.context.type == 'album') {
                setAlbum(response.data.context.uri);
            }

            setCp(response.data.item.id);
        })
        .catch((err) => {
            console.log("get currently playing track error: " + err);
        });

        setTimeout(() => {
            getPlayingData();
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
                episode ? 
                    <p>An episode (no music)</p>
                :
                    <></>
            }
            {
                currPlaying ? 
                    <Track trackId={currPlaying}/>
                :
                    <></>
            }
            {
                album ?
                    <>
                        <p> on </p>
                        <Album albumUri={album}/>
                    </>
                    
                :
                    <></>

            }
            {
                playlist ?
                    <>
                        <p> on </p>
                        <Playlist playlistUri={playlist}/>
                    </>
                :
                    <></>

            }
            {warning}
            <hr/>
        </div>
    )
}

export default Playing;