import volumeControl from "../../functionality/volumeControl";
import "./ControlVolume.css";
import React, {useEffect, useState} from "react";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";
import AdjacentSliders from "../../components/timeSliders/TimeSliders";

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
            for (let i = 0; i < vals.length; i++) {
                if (vals[i][2] === "touched") {
                    volumeController.setPreferredVolume(vals[i][1], vals[i][0]);
                }
            }
    
            volumeController.enableVolumeControl();
            volumeController.controlVolume();
            return res();
        });
        
    }

    return (
        <div>   
            <GoHomeButton onGoHome={handleGoHome}/>
            <AdjacentSliders
                onChange={(prefVolumes) => setVals(Array.from(prefVolumes))}
                getOriginalValue={(hour) => {
                    return volumeController.getPreferredVolumeForHour(hour);
                }}
                defaultValue={100}
            />
        </div>
    )


}

export default ControlVolume;