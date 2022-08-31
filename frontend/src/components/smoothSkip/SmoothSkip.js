import spotifyControl from "../../functionality/spotifyControl";


/**
 * @returns button for smoothly skipping track
 */
const SmoothSkip = () => {

    const controller = spotifyControl();

    const controlVolume = (val) => {
        console.log("val: " + val);
        controller.controlVolume(val);
    }

    return (
        <div>
            <input type="range" min="0" max="100" className="horizontalSlider" onChange={(e) => controlVolume(e.target.value)}></input>
            <button onClick={() => controller.smoothSkip()}>Smooth skip</button>
        </div>
    )
}

export default SmoothSkip;

