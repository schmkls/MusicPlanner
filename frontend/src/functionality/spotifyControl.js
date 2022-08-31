import spotifyAccess from "./spotifyAccess"
import axios from "axios";

const spotifyControl = () => {

    const accessor = spotifyAccess();


    const controlVolume = async(volume) => {
        if (volume > 100) volume = 100;

        if (volume < 0) volume = 0;

        console.log("setting volume to: " + volume);

        return new Promise((res, rej) => {
            const accessToken = accessor.getSpotifyAccessToken();

            const putUrl = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;
            axios.put(putUrl, null,{ headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                if (response.status < 200 || response.status > 299) {
                    console.log("control volume bad response");
                    return rej("Error adjusting volume");
                }
                return res("Volume adjusted");
            })
            .catch((error) => {
                console.log("control volume error: ", error);
                return rej("Error adjusting volume");
            });
        });   
    }
    
    
    const getCurrVolume = async() => {
        const accessToken = accessor.getSpotifyAccessToken();

        return new Promise((res, rej) => {
            axios.get('https://api.spotify.com/v1/me/player', { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                if (response.status < 200 || response.status > 299) {
                    return rej("Get playback state bad response");
                }

                return res(response.data.device.volume_percent);
            })
            .catch((err) => {
                return rej("get curr volume error", err);
            });

        });
    }

    const repeat = async(func, times) => {
        await func();
        times && --times && repeat(func, times);
    }

    

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const smoothSkip = async() => {
        let originalVolume = await getCurrVolume()
        .catch((err) => {
            console.log("Could not smooth skip", err);
            return;
        });

        let currVolume = originalVolume;
        //hämta nuvarande volym
        let times = 1;

        repeat(async() => {
            console.log("controlling volume to: " + Math.round(currVolume / 2));
            await controlVolume(Math.round(currVolume / 2));
            currVolume = currVolume / 2;
            times++;
            await sleep(2000);
            console.log("should have lowered volume");
        }, 4)

        

        //sänk fr nuvarande till 0, vänta på varje sänkning med timeout
        //byt låt
        //höj på samma sätt
    }


    const readUpcomingTracks = () => {

    }


    /**
     * Keeps tracks in queue that is filtered according to prefered
     * tempo/popularity. 
     */
    const keepFilteredTracksInQueue = () => {

    } 


    
    

    return {
        smoothSkip,
        controlVolume, 
        keepFilteredTracksInQueue
    }
}

export default spotifyControl;