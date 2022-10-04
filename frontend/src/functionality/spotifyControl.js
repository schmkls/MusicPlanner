import * as accessor from "./spotifyAccess"
import axios from "axios";
import * as musicScheduler from "./musicScheduling";
import * as queueHandler from "./queueHandling";

export const getPlayingTrack = async() => {
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

export const skipTrack = async() => {
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


export const isAlbum = (uri) => {
    return (uri.includes(':album:'));
}


export const isPlaylist = (uri) => {
    return (uri.includes(':playlist:'));
}


/**
 * Returns array of track-uris in album identified by @param uri. 
 */
export const getTracksInAlbum = async(uri) => {
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

export const getTracksInPlaylist = async(uri) => {
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


export const spotifyIdFromUri = (uri) => {
    return uri.substring(uri.lastIndexOf(':') + 1);
}


export const musicControlIsOn = () => {
    return localStorage.getItem("MUSIC_CONTROL") == "ON";
}


const enableMusicControl = () => {
    console.log("enabling music control");
    localStorage.setItem("MUSIC_CONTROL", "ON");
}


export const startMusicControl = () => {
    enableMusicControl();
    controlMusic();
}


/**
 * Keeps scheduled tracks in queue.
 */
export const controlMusic = () => {
    if (!musicControlIsOn()) return;

    console.log("controlling music");

    let queueable = musicScheduler.getUnplayedScheduledForNow();
    if (queueable.length === 0) queueable = musicScheduler.getPlayedScheduledForNow();
    
    queueHandler.fillQueue(queueable);

    if (musicScheduler.musicIsScheduledForNow()) {
        setTimeout(() => controlMusic(), 30000);
    }
}


export const stopControlMusic = () => {
    console.log('stopping controlling music');
    localStorage.setItem("MUSIC_CONTROL", "OFF");
}


export const enqueueTrack = async(trackUri) => {
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




   
 
