import Playing from "../../components/playing/Playing";
import SourcesDisplay from "../../components/sources/Sources";
import React, { useEffect, useState } from "react";
import axios from "axios";
import spotifyAccess from "../../functionality/spotifyAccess";
import navigate from "../../functionality/navigate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import 'bootstrap/dist/css/bootstrap.min.css';


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
            setDeviceActive(true);
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


    const handleSourceAdd = () => {

    }


    //todo: displaya sources

    return (
        <>
            <button onClick={() => window.location.assign(navigator.getURL(navigator.pages.info))}>
                Help
                <FontAwesomeIcon icon={faInfoCircle}/>
            </button>  
            <SourcesDisplay/>
            <br/>
            <br/>
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