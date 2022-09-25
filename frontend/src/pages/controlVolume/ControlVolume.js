import volumeControl from "../../functionality/volumeControl";
import "./ControlVolume.css";
import React, {useEffect, useState} from "react";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import TimeSliders from "../../components/timeSliders/TimeSliders";
import ExpandButton from "../../components/expandButton/ExpandButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const TOUCHED = "touched";
const UNTOUCHED ="unTouched"; 

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

            let scheduled = false;

            for (let i = 0;  i < vals.length; i++) {
                if (vals[i][2] === TOUCHED) scheduled = true;
            }

            //return if no volume scheduled
            if (!scheduled) return res();

            for (let i = 0; i < vals.length; i++) {
                volumeController.setPreferredVolume(vals[i][1], vals[i][0]);
            }

            return res();
        });
    }

    const handleReset = () => {
        volumeController.stopControlVolume();
        volumeController.removeSchedule();
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
                            (green nodes show times when volume is set)<br/>
                        3. Keep MusicPlanner open in a tab in your web browser.<br/>
                        3. Play music!<br/>
                    </p>
                }
            />
            <TimeSliders
                onChange={(prefVolumes) => setVals(Array.from(prefVolumes))}
                getOriginalValue={(hour) => {
                    return volumeController.getPreferredVolumeForHour(hour);
                }}
                defaultValue={100}
                onReset={() => handleReset()}
            />
        </div>
    )


}

export default ControlVolume;