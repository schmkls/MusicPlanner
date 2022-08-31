import spotifyAccess from "./spotifyAccess"
import axios from "axios";

const spotifyControl = () => {

    const accessor = spotifyAccess();

    const smoothSkip = () => {
        
    }


    const readUpcomingTracks = () => {

    }


    /**
     * Keeps tracks in queue that is filtered according to prefered
     * tempo/popularity. 
     */
    const keepFilteredTracksInQueue = () => {

    } 


    const controlVolume = (volume) => {
        const accessToken = accessor.getSpotifyAccessToken();

        const putUrl = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;
        axios.put(putUrl, null,{ headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("control volume bad response");
            }
        })
        .catch((error) => console.log("control volume error: ", error));
    }
    

    return {
        smoothSkip,
        controlVolume, 
        keepFilteredTracksInQueue
    }
}

export default spotifyControl;