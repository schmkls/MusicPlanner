import spotifyControl from "../../functionality/spotifyControl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepForward } from '@fortawesome/free-solid-svg-icons'


/**
 * @returns button for smoothly skipping track
 */
const SmoothSkip = (props) => {

    return (
        <div>
            <button onClick={() => {
                spotifyControl().smoothSkip()
                .then(() => props.onSkip())
            } }>
                Smooth skip
                <FontAwesomeIcon icon={faStepForward} size='2x'/>
            </button>
        </div>
    )
}

export default SmoothSkip;

