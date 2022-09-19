import axios from "axios";
import React, { useEffect, useState } from "react";
import Track from "../track/Track";
import Playlist from "../playlist/Playlist";
import Album from "../album/Album";
import SourcesDisplay from "../sources/sourcesDisplay/SourcesDisplay";
import SmoothSkip from "../smoothSkip/SmoothSkip";
import AddSources from "../sources/addSources/AddSources";
import spotifyAccess from "../../functionality/spotifyAccess";
import spotifyControl from "../../functionality/spotifyControl";


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
    const [playingFromSources, setPlayingFromSources] = useState(false);    //true when playing from added sources


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

        setPlayingFromSources(spotifyControl().sourcesTracksLeft());
        //console.log("playing from sources = ", spotifyControl().sourcesTracksLeft());

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
            <SmoothSkip onSkip={() => {console.log("smooth skip callbacked")}}/>
            {
                isPlaying ? 
                    episode ? 
                        <p>An episode (no music)</p>
                    :
                        currPlaying ? 
                            <Track trackId={currPlaying}/>
                        :
                            <p>Unknown track playing</p>
                :
                    <p>(paused)</p>
            }
            from
            {
                    playingFromSources ? 
                        <SourcesDisplay/>
                    :

                        album ?
                            <>
                                <Album albumUri={album} openable={true}/>
                            </>
                        :
                            playlist ?
                                <>
                                    <Playlist playlistUri={playlist} openable={true}/>
                                </>
                            :
                                <p>Unknown source</p>
            }
            {warning}
            <AddSources onAdd={(uri) => {
                spotifyControl().addSource(uri);
                getPlayingData();
                //setPlayingFromSources(true);
            }}/>
            <hr/>   
        </div>
    )
}

export default Playing;