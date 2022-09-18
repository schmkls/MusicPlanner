import volumeControl from "../../functionality/volumeControl";
import "./ControlVolume.css";
import React, {useState} from "react";
import GoHomeButton from "../../components/goHomeButton/GoHomeButton";

const ControlVolume = () => {

    const [volumeIsSet, setVolumeIsSet] = useState(false); //true when preffered volume is set (changed from default)

    const [val, setVal] = useState(0);
    const volumeController = volumeControl();

    return (
        <div>   
            <GoHomeButton onGoHome={() => {
                if (!volumeIsSet) return;

                volumeController.enableVolumeControl();
                volumeController.controlVolume();
            }}/>
            

            {/*
                todo: many of these sliders for each time step
            */}
            <input value={val} type="range" min="0" max="100" className="horizontalSlider" onChange={(e) => setVal(e.target.value)}></input>   
        </div>
    )


}

export default ControlVolume;