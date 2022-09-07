import Playing from "../../components/playing/Playing";
import SmoothSkip from "../../components/smoothSkip/SmoothSkip";
import AddSources from "../../components/addSources/AddSources";
import SourcesDisplay from "../../components/sourcesDisplay/SourcesDisplay";
import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import spotifyAccess from "../../functionality/spotifyAccess";
import spotifyControl from "../../functionality/spotifyControl";
import navigate from "../../functionality/navigate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

const UPDATE_INTERVAL = 5000;


//todo: kolla hur använda bootstrap
const Start = () => {

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

        setTimeout(() => checkIfDeviceActive(), UPDATE_INTERVAL);
    }


    useEffect(() => {
        checkIfDeviceActive();
    });

    
    const handleVolumeControl = (val) => {
        console.log("val: " + val);
    }

    const handleMusicControl = () => {
        
    }


    //todo: displaya sources

    return (
        <>
            <button onClick={() => window.location.assign(navigator.getURL(navigator.pages.info))}>
                Help
                <FontAwesomeIcon icon={faInfoCircle}/>
            </button>  
            <AddSources/>
            <SourcesDisplay/>
            {
                deviceActive ?
                        <>
                            <Playing/>
                        </> 
                
                    :
                        <h2>Not playing anything in Spotify right now</h2>
            }
            
            <BootstrapSwitchButton
                checked={false}
                onlabel='ON'
                offlabel='OFF'
                size='lg'
                onChange={(e) => {
                    console.log(JSON.stringify(e));
                }}

            />
        </>
    )

}

export default Start;