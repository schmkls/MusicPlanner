import spotifyAccess from "./spotifyAccess"
import axios from "axios";
import musicScheduling from "./musicScheduling";
import queueHandling from "./queueHandling";

const spotifyControl = () => {

    const accessor = spotifyAccess();
    const queueHandler = queueHandling();

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


    /**
     * Returns array of track-uris in album identified by @param uri. 
     */
    const getTracksInAlbum = async(uri) => {
        return new Promise((res, rej) => {
            let tracks = [];

            const accessToken = accessor.getSpotifyAccessToken();
            const id = spotifyIdFromUri(uri);    
            
            const getUrl = `https://api.spotify.com/v1/albums/${id}`
                axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
                .then((response) => {
                    for (let item in response.data.tracks.items) {
                        tracks.push(response.data.tracks.items[item].uri);
                    }

                    return res(tracks);
                })
                .catch((err) => {
                    return rej("Could not get tracks");
                });

        });
        
    }

    const getTracksInPlaylist = async(uri) => {
        return new Promise((res, rej) => {
            let tracks = [];

            const accessToken = accessor.getSpotifyAccessToken();
            const id = spotifyIdFromUri(uri);    

            const getUrl = `https://api.spotify.com/v1/playlists/${id}`
            axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                
                for (let track in response.data.tracks.items) {
                    tracks.push(response.data.tracks.items[track].track.uri);
                }
                
                return res(tracks);
            })
            .catch((err) => {
                return rej("Could not get tracks");
            });

        });
 
           
    
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

        let queueable = musicScheduler.getUnplayedScheduledForNow();
        if (queueable.length === 0) queueable = musicScheduler.getPlayedScheduledForNow();
        
        queueHandler.fillQueue(queueable);

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
        getTracksInAlbum, 
        getTracksInPlaylist,
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