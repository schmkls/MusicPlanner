import Playing from "../../components/playing/Playing";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as spotifyAccessor from "../../functionality/spotifyAccess";
import * as navigator from "../../functionality/navigate";
import * as volumeController from "../../functionality/volumeControl";
import * as spotifyController from "../../functionality/spotifyControl";
import * as musicScheduler from "../../functionality/musicScheduling";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


const UPDATE_INTERVAL = 10000;


//todo: kolla hur använda bootstrap
const Start = () => {

    const [deviceActive, setDeviceActive] = useState(true);
    const [volumeWarning, setVolumeWarning] = useState(false);
    const [musicWarning, setMusicWarning] = useState(false);

 
    const checkIfDeviceActive = () => {
        const accessToken = spotifyAccessor.getSpotifyAccessToken();
        
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
        setMusicWarning();
        if (on) {
            spotifyController.startMusicControl();
            if (!musicScheduler.musicIsScheduledForNow()) {
                setMusicWarning(
                    <div>
                        <p>Click here to make music schedule</p>
                        <FontAwesomeIcon icon={faArrowDown}/>
                    </div>
                )
            }
        } else {
            spotifyController.stopControlMusic()
        }
    }


    const handleSourceAdd = () => {

    }


    if (!deviceActive) {
        
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
            {musicWarning}
            <button onClick={() => navigator.navigate(navigator.pages.musicControl)}>
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