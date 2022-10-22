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
    const [volumeControlIsOn, setVolumeControlIsOn] = useState(false);
    const [musicControlIsOn, setMusicControlIsOn] = useState(false);
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
        setVolumeControlIsOn(volumeController.volumeControlIsOn());
        setMusicControlIsOn(spotifyController.musicControlIsOn());
    }, []);
    

    useEffect(() => {
        console.log("setting mc to: ", musicControlIsOn);

        let musicIsScheduled = musicScheduler.musicIsScheduledForNow();
        if (musicControlIsOn && !musicIsScheduled) {
            setMusicWarning(
                <p>
                    No music scheduled for now, click here to schedule
                </p>
            )
        } else {
            setMusicWarning(<></>)
        }

        if (musicControlIsOn) {
            spotifyController.startMusicControl();
        } else {
            spotifyController.stopControlMusic()
        }
    }, [musicControlIsOn]);


    useEffect(() => {
        console.log("setting vc to: ", volumeControlIsOn);
        
        let volumesScheduled = volumeController.volumesScheduled();

        if (volumeControlIsOn && !volumesScheduled) {
            setVolumeWarning(
                <div>
                    <p>Click here to make volume schedule</p>
                    <FontAwesomeIcon icon={faArrowDown}/>
                </div>
            )
        } else {
            setVolumeWarning(<></>);
        }

        if (volumeControlIsOn) {
            volumeController.startVolumeControl();
        } else {
            volumeController.stopControlVolume();
        }
    }, [volumeControlIsOn]);
    

    //todo: displaya sources
    return (
        <div>
            <button onClick={() => window.location.assign(navigator.getURL(navigator.pages.info))}>
                Help
                <FontAwesomeIcon icon={faInfoCircle}/>
            </button>  
            <div className="top">
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
            </div>
            
            <button onClick={() => navigator.navigate(navigator.pages.volumeControl)}>
                Volume control
            </button>
            <BootstrapSwitchButton
                checked={volumeControlIsOn}
                onlabel='ON'
                offlabel='OFF'
                size='lg'
                onChange={(e) => {
                    setVolumeControlIsOn(e);
                }}
            />
            <br/>
            <br/>
            {musicWarning}
            <button onClick={() => navigator.navigate(navigator.pages.musicControl)}>
                Music control
            </button>
            <BootstrapSwitchButton
                checked={musicControlIsOn}
                onlabel='ON'
                offlabel='OFF'
                size='lg'
                onChange={(e) => {
                    setMusicControlIsOn(e);
                }}
            />
            <br/>

        </div>
    )

}

export default Start;