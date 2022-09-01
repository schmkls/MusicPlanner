import Playing from "../../components/playing/Playing";
import SmoothSkip from "../../components/smoothSkip/SmoothSkip";
import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import spotifyAccess from "../../functionality/spotifyAccess";

const Start = () => {

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [deviceActive, setDeviceActive] = useState(true);

 
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
            </div>
        )
    }

    return (
        <>
            <Playing/>
            <SmoothSkip onSkip={() => forceUpdate()}/>
        </>
    )

}

export default Start;