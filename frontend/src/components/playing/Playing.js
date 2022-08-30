import axios from "axios";

/**
 * Display currently playing track
 */
const Playing = () => {

    const getCurrPlaying = () => {
        axios.get()
        .then((res) => {
            if (res.status < 200 || res.status > 299) {
                console.log("get currently playing track bad response: "  + JSON.stringify(res));
            }

            console.log("curr playing resp: " + JSON.stringify(res));

        })
        .catch((err) => {
            console.log("get currently playing track error: " + err);
        });
    }

    return (
        <></>
    )
}

export default Playing;