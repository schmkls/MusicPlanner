import volumeControl from "../../functionality/volumeControl";
import "./ControlVolume.css";
import React, { useEffect, useState, useReducer} from "react";

const ControlVolume = () => {

    console.log("returning ControlVolume");

    const volumeController = volumeControl();

    return (
        <div>   
           <button onClick={() => {
                volumeController.enableVolumeControl();
                volumeController.controlVolume();
            }}>
                Starta volume control
           </button>
        </div>
    )


}

export default ControlVolume;