import axios from "axios";
import React, { useEffect, useState } from "react";
import Track from "../track/Track";
import Playlist from "../playlist/Playlist";
import Album from "../album/Album";
import SmoothSkip from "../smoothSkip/SmoothSkip";
import spotifyAccess from "../../functionality/spotifyAccess";


const UPDATE_INTERVAL = 10000;  //10 seconds

/**
 * Display currently playing track
 */
const Playing = () => {

    console.log("returning playing");

    const [currPlaying, setCp] = useState(null);    //currently playing track
    const [playlist, setPlaylist] = useState(null);
    const [album, setAlbum] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true); //true if playing, false if paused
    const [episode, setEpisode] = useState(false);  //true if episode being played
    const [warning, setWarning] = useState(null); 

    const spotifyAccessor = spotifyAccess();


    const setAllStatesNull = () => {
        setCp(null);
        setPlaylist(null);
        setAlbum(null);
        setEpisode(null);
        setWarning(null);
    }


    const getPlayingData = () => {        
        const accessToken = spotifyAccessor.getSpotifyAccessToken();

        axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("get currently playing track bad response");
                return;
            }

            //console.log(JSON.stringify(response, null, 2));

            if (!response.data) {
                return;
            }

            setAllStatesNull();
            setIsPlaying(response.data.is_playing);
            setCp(response.data.item.id);

            if (response.data.currently_playing_type == 'episode') {
                setEpisode(true);
                return;
            }

            if (response.data.context == null) {
                setCp(response.data.item.id);

                //if tempo or popularity filtering active
                    setWarning("Tempo and popularity control will only work when playing a playlist or album");
                return;
            }
            
            if (response.data.context.type == 'playlist') {
                setPlaylist(response.data.context.uri);
            }   

            if (response.data.context.type == 'album') {
                setAlbum(response.data.context.uri);
            }            
        })
        .catch((err) => {
            console.log("get currently playing track error: " + err);
        });

        setTimeout(() => {
            getPlayingData();
        }, UPDATE_INTERVAL);
    }

    useEffect(() => {
        getPlayingData();
    },[]);



    return (
        <div>
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
                        <Album albumUri={album} openable={true}/>
                    </>
                    
                :
                    <></>

            }
            {
                playlist ?
                    <>
                        <p> on </p>
                        <Playlist playlistUri={playlist} openable={true}/>
                    </>
                :
                    <></>

            }
            {warning}
            <SmoothSkip onSkip={() => {}}/>
            <hr/>
        </div>
    )
}

export default Playing;