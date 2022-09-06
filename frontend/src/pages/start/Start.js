import Playing from "../../components/playing/Playing";
import SmoothSkip from "../../components/smoothSkip/SmoothSkip";
import ControlVolume from "../controlVolume/ControlVolume";
import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import spotifyAccess from "../../functionality/spotifyAccess";
import spotifyControl from "../../functionality/spotifyControl";
import navigate from "../../functionality/navigate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Start = () => {

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [deviceActive, setDeviceActive] = useState(true);

    const navigator = navigate();

 
    const checkIfDeviceActive = () => {

        
        const accessToken = spotifyAccess().getSpotifyAccessToken();
        
        axios.get('https://api.spotify.com/v1/me/player', { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status == 204 || !response.data || response.data == "") {
                setDeviceActive(false);
            }
        });

        setTimeout(() => checkIfDeviceActive(), 5000);
    }


    useEffect(() => {
        checkIfDeviceActive();
    });


    if (!deviceActive) {
        return (
            <div>
                <h2>Not playing anything in Spotify</h2>
                <button onClick={() => window.location.assign(navigator.getURL(navigator.pages.info))}>
                    <p>Help</p>
                    <FontAwesomeIcon icon={faInfoCircle} size="2x"/>
                </button>    
            </div>
        )
    }

    return (
        <>
            <Playing/>
            <SmoothSkip onSkip={() => forceUpdate()}/>
            <ControlVolume/>     
            <button onClick={() => spotifyControl().readUpcomingTracks()}>
                <h2>Läs kommande</h2>
            </button>    
            <button onClick={() => window.location.assign(navigator.getURL(navigator.pages.info))}>
                    <p>Help</p>
                    <FontAwesomeIcon icon={faInfoCircle} size="2x"/>
            </button>        
        </>
    )

}

export default Start;