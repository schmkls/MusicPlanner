import spotifyControl from "../../functionality/spotifyControl";


/**
 * @returns button for smoothly skipping track
 */
const SmoothSkip = (props) => {

    return (
        <div>
            <button onClick={() => {
                spotifyControl().smoothSkip()
                .then(() => props.onSkip())
            } }>Smooth skip</button>
        </div>
    )
}

export default SmoothSkip;

