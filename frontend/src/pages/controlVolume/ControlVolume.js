import volumeControl from "../../functionality/volumeControl";
import "./ControlVolume.css";
import React, { useEffect, useState, useReducer} from "react";

const ControlVolume = () => {

    console.log("returning ControlVolume");

    const volumeController = volumeControl();

    return (
        <div>   
            <h2>todo wihu rita graf för volym över dagen</h2>
           <button onClick={() => {
                volumeController.enableVolumeControl();
                volumeController.controlVolume();
            }}>
                Start volume control
           </button>

           <button onClick={() => volumeController.stopControlVolume()}>
                Stop volume control
           </button>
        </div>
    )


}

export default ControlVolume;