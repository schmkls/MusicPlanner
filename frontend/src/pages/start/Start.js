import Playing from "../../components/playing/Playing";
import React, { useEffect, useState } from "react";
import axios from "axios";
import spotifyAccess from "../../functionality/spotifyAccess";
import navigate from "../../functionality/navigate";
import volumeControl from "../../functionality/volumeControl";
import spotifyControl from "../../functionality/spotifyControl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


const UPDATE_INTERVAL = 5000;


//todo: kolla hur använda bootstrap
const Start = () => {

    const [deviceActive, setDeviceActive] = useState(true);
    const [volumeWarning, setVolumeWarning] = useState(false);

    const navigator = navigate();
    const volumeController = volumeControl();
    const spotifyController = spotifyControl();

 
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
    }, []);

    
    const handleVolumeControl = (on) => {
        setVolumeWarning();
        if (on) {
            volumeController.startVolumeControl();
            if (!volumeController.volumesScheduled()) {
                setVolumeWarning(
                    <div>
                        <p>Click here to make volume schedule</p>
                        <FontAwesomeIcon icon={faArrowDown}/>
                    </div>
                )
            } 
        } else {
            volumeController.stopControlVolume()
        }
    }

    const handleMusicControl = (on) => {
        if (on) {
            spotifyController.startMusicControl();
        } else {
            spotifyController.stopControlMusic()
        }
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
            {volumeWarning}
            <button onClick={() => navigator.navigate(navigator.pages.volumeControl)}>
                Volume control
            </button>
            <BootstrapSwitchButton
                checked={volumeController.volumeControlIsOn()}
                onlabel='ON'
                offlabel='OFF'
                size='lg'
                onChange={(e) => {
                    handleVolumeControl(e);
                }}
            />
            <br/>
            <br/>
            <button onClick={() => navigator.navigate(navigator.pages.musicsControl)}>
                Music control
            </button>
            <BootstrapSwitchButton
                checked={false}
                onlabel='ON'
                offlabel='OFF'
                size='lg'
                onChange={(e) => {
                    handleMusicControl(e);
                }}
            />
            <br/>

        </>
    )

}

export default Start;