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
            axios.put(putUrl, null, { headers: { Authorization: `Bearer ${accessToken}`} })
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
        times && --times && await repeat(func, times);
        return new Promise((res) => res("Repeat finished"));
    }

    const skipTrack = async() => {
        return new Promise((res, rej) => {
            const accessToken = accessor.getSpotifyAccessToken();
            const postUrl = `https://api.spotify.com/v1/me/player/next`;
            axios.post(postUrl, null, { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                if (response.status < 200 || response.status > 299) return rej("Skip track bad resonse");
                res("Skipped track");
            })
            .catch((err) => {return rej("Skip track error", err)})
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const slowlyLowerVolume = async(originalVolume) => {
        return new Promise(async(res, rej) => {
            let nTimes = 8;
            let currVolume = originalVolume;

            await repeat(async() => {
                console.log("controlling volume to: " + Math.round(currVolume - (originalVolume / nTimes)));
                await controlVolume(Math.round(currVolume - (originalVolume / nTimes)));
                currVolume = currVolume - (originalVolume / nTimes);
                await sleep(100);
            }, nTimes)


            return res(currVolume);
        });
    }


    const slowlyHigherVolume = async(currVolume, maxVolume) => {
        let nTimes = 8;
        let step = (maxVolume - currVolume) / nTimes;

        return new Promise(async(res, rej) => {
            let originalVolume = await getCurrVolume()
            .catch((err) => {
                return (rej("Could not slowly higher volume: ", err));
            });

            let currVolume = originalVolume;

            await repeat(async() => {
                console.log("controlling volume to: " + Math.round(currVolume + step));
                await controlVolume(Math.round(currVolume + step));
                currVolume = currVolume + step;
                await sleep(500);
            }, nTimes)


            return res("Volume lowered");
        });
    }


    const smoothSkip = async() => {
        console.log("smooth skipping");

        return new Promise(async(res, rej) => {

            const originalVolume = await getCurrVolume()
            .catch((err) => {
                return rej("Could not smoothskip", err)
            });
            
            const volume = await slowlyLowerVolume(originalVolume)
            .catch((err) => {
                console.log("Could not smoothskip ", err);
            })

            await skipTrack()
            .catch((err) => {
                console.log("Could not smoothskip ", err);
            })


            await slowlyHigherVolume(volume, originalVolume)
            .catch((err) => {
                console.log("Could not smoothskip ", err);
            })

            res("Skipped track");
        });
        
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