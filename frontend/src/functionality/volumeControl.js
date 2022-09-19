import spotifyAccess from "./spotifyAccess";
import spotifyControl from "./spotifyControl";
import axios from "axios";

const times = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]


const volumeControl = () => {

    const accessor = spotifyAccess();


    const adjustVolume = async(volume) => {
        if (volume > 100) volume = 100;

        if (volume < 0) volume = 0;

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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const slowlyLowerVolume = async(originalVolume) => {
        return new Promise(async(res, rej) => {
            let nTimes = 8;
            let currVolume = originalVolume;

            await repeat(async() => {
                await adjustVolume(Math.round(currVolume - (originalVolume / nTimes)))
                .catch((err) => rej(err));
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
                await adjustVolume(Math.round(currVolume + step));
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
                rej(err);
            })

            await spotifyControl().skipTrack()
            .catch((err) => {
                console.log("Could not smoothskip ", err);
                rej(err);
            })


            await slowlyHigherVolume(volume, originalVolume)
            .catch((err) => {
                console.log("Could not smoothskip ", err);
                rej(err);
            })

            res("Skipped track");
        });
    }


    const enableVolumeControl = () => {
        localStorage.setItem('VOLUME_CONTROL', 'ON');
    }

    const setPreferredVolume = (volume, hour) => {
        localStorage.setItem(`PREF_VOLUME_${hour}`, volume);
    }

    const getPreferredVolumeForHour = (hour) => {
        return localStorage.getItem(`PREF_VOLUME_${hour}`);
    }

    //todo 
    const getPreferredVolumeNow = () => {
        const hrNow = new Date().getHours();
        const timeNow = new Date().getHours() + (new Date().getMinutes() / 60);
        
        let preferredVolume;

        let leftPreferred;
        let leftTime;
        let rightPreferred;
        let rightTime;

        
        for (let i = hrNow - 1; i >= 0; i--) {
            leftPreferred = getPreferredVolumeForHour(i);
            leftTime = i;
            if (leftPreferred) break;
        }

        
        for (let j = hrNow + 1; j <= 24; j++) {
            rightPreferred = getPreferredVolumeForHour(j);
            rightTime = j;
            if (rightPreferred) break;
        }

        if (!leftPreferred) {
            leftPreferred = 100;
            leftTime = hrNow - 2;
        }

        
        if (!rightPreferred) {
            if ((rightPreferred = getPreferredVolumeForHour(0))) {
                rightTime = 24;
            } else {
                console.log("wihu oo noo");
                rightPreferred = 100;
                rightTime = hrNow + 2;

            }
        }

        console.log('left: ', leftPreferred, " , ", leftTime, 'right: ', rightPreferred, ", ", rightTime);

        let lean = (parseFloat(rightPreferred) - parseFloat(leftPreferred)) / (rightTime - leftTime);
        preferredVolume = parseFloat(leftPreferred) + lean * (timeNow - leftTime);

        return Math.round(preferredVolume);
    }


    const volumeControlIsOn = () => {
        return localStorage.getItem('VOLUME_CONTROL') === "ON";
    }

    /**
     * Keeps controlling volume while localstorage item 'VOLUME_CONTROL' equals 'ON'
     */
    const controlVolume = () => {
        if (!volumeControlIsOn()) return;

        const prefVolume = getPreferredVolumeNow();

        prefVolume ? adjustVolume(prefVolume) : console.log("preffered volume not set");
        
        console.log("preferred volume for now:", prefVolume);
        setTimeout(() => controlVolume(), 5000);
    }


    const stopControlVolume = async() => {
        return new Promise((res, rej) => {
            localStorage.setItem('VOLUME_CONTROL', 'OFF');
            for (let hr = 0; hr <= 24; hr++) {
                localStorage.removeItem(`PREF_VOLUME_${hr}`);
            }
            return res();
        });   
    }


    return {
        enableVolumeControl,
        controlVolume,         //calling enableVolumeControl and controlVolume will start volume control
        stopControlVolume, 
        setPreferredVolume,
        getPreferredVolumeForHour,
        smoothSkip, 
        times
    }

}

export default volumeControl;