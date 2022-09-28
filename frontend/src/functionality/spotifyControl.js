import spotifyAccess from "./spotifyAccess"
import axios from "axios";
import musicScheduling from "./musicScheduling";

const spotifyControl = () => {

    const accessor = spotifyAccess();


    const getPlayingTrack = async() => {
        return new Promise((res, rej) => {
            const accessToken = accessor.getSpotifyAccessToken();
        
            //get playing track
            const getUrl = `https://api.spotify.com/v1/me/player`;

            axios.get(getUrl, { 
                headers: { Authorization: `Bearer ${accessToken}`} 
            })
            .then((response) => {
                if (response.status < 200 || response.status > 299) {
                    rej(response);
                }
                res(response.data.item.uri);
            })
            .catch((err) => {
                rej(err);
            });
        });
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

    const isAlbum = (uri) => {
        return (uri.includes(':album:'));
    }

    const isPlaylist = (uri) => {
        return (uri.includes(':playlist:'));
    }

    const spotifyIdFromUri = (uri) => {
        return uri.substring(uri.lastIndexOf(':') + 1);
    }

    const musicControlIsOn = () => {
        return localStorage.getItem("MUSIC_CONTROL") == "ON";
    }


    const enableMusicControl = () => {
        console.log("enabling music control");
        localStorage.setItem("MUSIC_CONTROL", "ON");
    }


    const startMusicControl = () => {
        enableMusicControl();
        controlMusic();
    }


    /**
     * Keeps scheduled tracks in queue.
     */
    const controlMusic = () => {
        const musicScheduler = musicScheduling();

        if (!musicControlIsOn()) return;

        console.log("controlling music");

        //todo: get some scheduled music (musisScheduler) and queue it (queueHandling)

        if (musicScheduler.musicIsScheduledForNow()) {
            setTimeout(() => controlMusic(), 30000);
        }
    }


    const stopControlMusic = () => {
        console.log('stopping controlling music');
        localStorage.setItem("MUSIC_CONTROL", "OFF");
    }


    const enqueueTrack = async(trackUri) => {
        return new Promise((res, rej) => {
            const accessToken = accessor.getSpotifyAccessToken();

            const postUrl = `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`;

            axios.post(postUrl, null, { 
                headers: { Authorization: `Bearer ${accessToken}`} 
            })
            .then((response) => {
                if (response.status < 200 || response.status > 299) {
                    console.log('enqueue bad response: ' + JSON.stringify(response));
                    rej(response);
                }
                res(trackUri);
            })
            .catch((err) => {
                console.log('enqueue track error: ' + JSON.stringify(err));
                rej(err)
            });
        });
    }




   
    return { 
        getPlayingTrack,
        isAlbum, 
        isPlaylist,
        spotifyIdFromUri, 
        skipTrack,
        enqueueTrack, 
        startMusicControl,
        controlMusic, 
        stopControlMusic, 
        musicControlIsOn
    }
}

export default spotifyControl;