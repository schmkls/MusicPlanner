import axios from "axios";
import React, { useEffect, useState } from "react";
import Track from "../track/Track";
import MusicSource from "../musicSource/MusicSource";
import SmoothSkip from "../smoothSkip/SmoothSkip";
import * as spotifyAccessor from "../../functionality/spotifyAccess";
import ScheduledMusic from "../scheduledMusic/ScheduledMusic";
import * as spotifyController from "../../functionality/spotifyControl";
import * as musicScheduler from "../../functionality/musicScheduling";

const UPDATE_INTERVAL = 5000;  

/**
 * Display currently playing track
 */
const Playing = () => {

    const [currPlaying, setCp] = useState(null);    //currently playing track
    const [source, setSource] = useState(null);     //album or playlist or null
    const [isPlaying, setIsPlaying] = useState(true); //true if playing, false if paused
    const [episode, setEpisode] = useState(false);  //true if episode being played
    const [warning, setWarning] = useState(null); 

    const [playingScheduled, setPlayingScheduled] = useState(false);
    


    const setAllStatesNull = () => {
        setCp(null);
        setSource(null);
        setEpisode(null);
        setWarning(null);
    }


    const getPlayingData = () => {        
        const accessToken = spotifyAccessor.getSpotifyAccessToken();

        axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            setAllStatesNull();

            if (response.status < 200 || response.status > 299) {
                setWarning("Something went wrong");
                return;
            }

            if (response.status === 204) {
                setWarning("Something went wrong, try using Spotify Web Player")
            }

            if (!response.data) return;
            
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
            
            if (response.data.context.type == 'playlist' || response.data.context.type == 'album') {
                setSource(response.data.context.uri);
            }            
        })
        .catch((err) => {
            console.log("get currently playing track error: " + err);
        });
    }

    useEffect(() => {
        getPlayingData();
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setPlayingScheduled(spotifyController.musicControlIsOn());
            getPlayingData();
        }, UPDATE_INTERVAL);

        return () => clearInterval(interval);
    });

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
                            <p>Unknown/no track playing</p>
                :
                    <p>(paused)</p>
            }
            from
            {
                playingScheduled ? <ScheduledMusic/> :

                source ? <MusicSource uri={source}/> :

                <p>Unknown source</p>

            }
            {warning}
            <hr/>   
        </div>
    )
}

export default Playing;