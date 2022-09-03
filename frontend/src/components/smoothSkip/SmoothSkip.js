import volumeControl from "../../functionality/volumeControl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepForward } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import { useEffect, useState } from "react";
import spotifyAccess from "../../functionality/spotifyAccess";

/**
 * @returns button for smoothly skipping tracks
 */
const SmoothSkip = (props) => {

    const [active, setIsActive] = useState(true);
   

    return (
        
        <div>
            <button onClick={() => {
                volumeControl().smoothSkip()
                .then(() => props.onSkip())
            } }>
                Smooth skip
                <FontAwesomeIcon icon={faStepForward} size='2x'/>
            </button>
        </div>
    )
}

export default SmoothSkip;

