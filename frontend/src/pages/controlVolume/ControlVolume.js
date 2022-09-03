import volumeControl from "../../functionality/volumeControl";
import "./ControlVolume.css";
import React, { useEffect, useState, useReducer} from "react";

const ControlVolume = () => {

    console.log("returning ControlVolume");

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const volumeController = volumeControl();

    const [vol19, setVol19] = useState();
    const [vol20, setVol20] = useState();

    const [val, setVal] =  useState(0);


    useEffect(() => {
        volumeController.setPreferredVolume(vol19, 19);
    }, [vol19]);


    useEffect(() => {
        volumeController.setPreferredVolume(vol20, 20);
    }, [vol20]);

    useEffect(() => {
        forceUpdate();
    }, [val]);


    return (
        <div>   
            todo: hur rita volymgraf
        </div>
    )


}

export default ControlVolume;