import * as accessor from "./spotifyAccess";
import * as spotifyController from "./spotifyControl";
import axios from "axios";

export const times = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3]; 
const UPDATE_INTERVAL = 30000;


export const adjustVolume = async(volume) => {
    if (volume > 100) volume = 100;

    if (volume < 0) volume = 0;

    return new Promise((res, rej) => {
        const accessToken = accessor.getSpotifyAccessToken();

        console.log("ADJUSTING VOLUME TO: ", volume, " at time: ", new Date().getHours() + ":" + new Date().getMinutes());
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


export const getCurrVolume = async() => {
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


export const smoothSkip = async() => {
    console.log("smooth skipping");

    return new Promise(async(res, rej) => {

        let originalVolume = await getCurrVolume()
        .catch((err) => {
            return rej("Could not smoothskip", err)
        });


        if (!originalVolume) {
            originalVolume = 50;
        }
        
        const volume = await slowlyLowerVolume(originalVolume)
        .catch((err) => {
            console.log("Could not smoothskip ", err);
            rej(err);
        })

        await spotifyController.skipTrack()
        .catch((err) => {
            console.log("Could not smoothskip ", err);
            rej(err);
        })


        await slowlyHigherVolume(volume, originalVolume)
        .catch((err) => {
            console.log("Could not smoothskip ", err);
            rej(err);
        })

        return res("Skipped track");
    });
}


const enableVolumeControl = () => {
    localStorage.setItem('VOLUME_CONTROL', 'ON');
}

export const setPreferredVolume = (volume, hour) => {
    localStorage.setItem(`PREF_VOLUME_${hour}`, volume);
}

export const getPreferredVolumeForHour = (hour) => {
    return localStorage.getItem(`PREF_VOLUME_${hour}`);
}

export const getPreferredVolumeNow = () => {
    let preferredVolume;
    let leftPreferred;
    let leftIndex;
    let rightPreferred;
    let rightIndex;
    let difference;
    const hrNow = new Date().getHours();
    let indexTimeNow;
    let indexNow;    //index of time with current hour in the array of times

    for (let i in times) {
        if (times[i] === hrNow) indexNow = i;
    }
    
    indexTimeNow = parseFloat(indexNow) + (new Date().getMinutes() / 60);
    
    for (let i = times[0]; i < times.length; i++) {
        let temp;
        if ((temp = getPreferredVolumeForHour(times[i])) && i <= indexNow) {
            leftPreferred = temp;
            leftIndex = i;
        }
    }

    
    for (let j = times[0]; j < times.length; j++) {
        let temp;
        if ((temp = getPreferredVolumeForHour(times[j])) && j > indexNow) {
            rightPreferred = temp;
            rightIndex = j;
            break;
        }
    }

    if (!leftPreferred || !rightPreferred) {
        return null;
    }

    difference = rightIndex - leftIndex;

    let lean = (parseFloat(rightPreferred) - parseFloat(leftPreferred)) / difference;
    preferredVolume = parseFloat(leftPreferred) + lean * (indexTimeNow - leftIndex);

    return Math.round(preferredVolume);
}


export const volumeControlIsOn = () => {
    return localStorage.getItem('VOLUME_CONTROL') === "ON";
}

export const volumesScheduled = () => {
    for (let i = 0; i < times.length; i++) {
        if (!getPreferredVolumeForHour(times[i])) {
            console.log("no volume scheduled for hour " + times[i]);
            return false;
        }
    }

    return true;
}

export const startVolumeControl = () => {
    enableVolumeControl();
    controlVolume();
}

/**
 * Keeps controlling volume while localstorage item 'VOLUME_CONTROL' equals 'ON'
 */
export const controlVolume = () => {
    if (!volumeControlIsOn()) return;

    if (!volumesScheduled()) {
        console.error("missing scheduled volume");
        return;
    }

    const prefVolume = getPreferredVolumeNow();

    prefVolume ? adjustVolume(prefVolume) : console.log("preferred volume not set, pv: " + prefVolume);
    
    setTimeout(() => controlVolume(), UPDATE_INTERVAL);
}


export const stopControlVolume = async() => {
    return new Promise((res, rej) => {
        localStorage.setItem('VOLUME_CONTROL', 'OFF');
        return res();
    });   
}

export const removeSchedule = () => {
    for (let i = 0; i < times.length; i++) {
        localStorage.removeItem(`PREF_VOLUME_${times[i]}`);
    }
}


