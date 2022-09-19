import volumeControl from "../../functionality/volumeControl";
import "./ControlVolume.css";
import React, {useEffect, useState} from "react";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import AdjacentSliders from "../../components/timeSliders/TimeSliders";
import ExpandButton from "../../components/expandButton/ExpandButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const ControlVolume = () => {

    /**
     * vals = 
     * [[hour, preferredVolume, touched], [hour, preferredVolume, touched], ...]
     * 
     *              where: 
     *                  hour = when volume is preferred
     *                  preferredVolume = preferred volume for hour (from 0 to 100)
     *                  touched = true if value has been changed from default
     */
    const [vals, setVals] = useState([]);        
    
    const volumeController = volumeControl();

    const handleGoHome = async() => {
        return new Promise((res) => {

            let prefVolumeSet = false;

            for (let i = 0; i < vals.length; i++) {
                if (vals[i][2] === "touched") {
                    volumeController.setPreferredVolume(vals[i][1], vals[i][0]);
                    prefVolumeSet = true;
                }
            }
            
            if (!prefVolumeSet) {
                console.log("no pref volume set, stops controlling volume");
                volumeController.stopControlVolume();
                return res();
            }

            volumeController.enableVolumeControl();
            volumeController.controlVolume();
            return res();
        });
        
    }

    return (
        <div>   
            <GoHomeButton onGoHome={handleGoHome}/>
            <ExpandButton 
                normalElement={
                    <div>
                        Help
                        <FontAwesomeIcon icon={faInfoCircle}/>
                    </div>
                } 
                expandElement={
                    <p>
                        1. Press control volume<br/>
                        2. Drag the nodes controlling Spotify-volume per hour<br/>
                           Green nodes show times when volume is chosen<br/>
                        4. Play music!<br/>
                    </p>
                }
            />
            <AdjacentSliders
                onChange={(prefVolumes) => setVals(Array.from(prefVolumes))}
                getOriginalValue={(hour) => {
                    return volumeController.getPreferredVolumeForHour(hour);
                }}
                defaultValue={100}
                onReset={() => volumeController.stopControlVolume()}
            />

        </div>
    )


}

export default ControlVolume;