import spotifyAccess from "./spotifyAccess"
import axios from "axios";

const times = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3];   

const SCHEDULED_MUSIC = 'SCHEDULED_MUSIC';
const SCHEDULED_TRACKS = 'SCHEDULED_TRACKS';

const spotifyControl = () => {

    const accessor = spotifyAccess();


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

    /**
     * Schedules tracks of album or playlist
     * 
     * @param uri Spotify uri of playlist/album
     * @param start from when track is scheduled (integer)
     * @param end to what hour track is scheduled (integer)
     */
    const addScheduledTracks = (uri, start, end) => {
        
        let tracks = localStorage.getItem(SCHEDULED_TRACKS) ? JSON.parse(localStorage.getItem(SCHEDULED_TRACKS)) : [];

        let trackUri;
        const accessToken = accessor.getSpotifyAccessToken();
        const id = spotifyIdFromUri(uri);
        if (isPlaylist(uri)) {
            const getUrl = `https://api.spotify.com/v1/playlists/${id}`
            axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                
                for (let track in response.data.tracks.items) {
                    trackUri = response.data.tracks.items[track].track.uri;
                    tracks.push({uri, trackUri, start, end});    
                }
                
                localStorage.setItem(SCHEDULED_TRACKS, JSON.stringify(tracks));
            })
            .catch((err) => console.error("add track sources error: ", err));
        } 


        if (isAlbum(uri)) {
            const getUrl = `https://api.spotify.com/v1/albums/${id}`
            axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                
                for (let item in response.data.tracks.items) {
                    trackUri = response.data.tracks.items[item].uri;
                    tracks.push({uri, trackUri, start, end});    
                }
                
                localStorage.setItem(SCHEDULED_TRACKS, JSON.stringify(tracks));
            })
            .catch((err) => console.log("add track sources error: ", err));
        } 
    }


    /**
     * @param uri spotify playlist or album uri  
     * @param start start time in hours (float), like 23.5 (for 23:30)
     * @param end end time
     */
    const scheduleMusic = (uri, start, end) => {
        console.log("SCHEDULING: ", uri, "from ", start, " to ", end);
    
        let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) ? JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) : [] ;

        let rescheduling = false;
        for (let i = 0; i < scheduled.length; i++) {
            if (scheduled[i][0] === uri) {
                scheduled[i] = [uri, start, end];
                rescheduling = true;
                break;
            }
        }

        if (!rescheduling) {
            scheduled.push([uri, start, end]);
        }
        
        localStorage.setItem(SCHEDULED_MUSIC, JSON.stringify(scheduled));
        //addScheduledTracks(uri, start, end);
    }
    

    const getScheduledMusic = () => {
        let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) ? JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) : [] ;
        console.log("scheduled when getting: ", scheduled);
        return scheduled;
    }


    //todo
    const unSchedule = (uri) => {
        
        let scheduled = getScheduledMusic();

        if (!scheduled) return;

        scheduled = scheduled.filter(function(sch) {
            return sch[0] !== uri;
        })


        localStorage.setItem(SCHEDULED_MUSIC, JSON.stringify(scheduled));
        //console.log("scheduled after unscheduling", uri, ": " + JSON.stringify(scheduled, null, 2));

    }


    


    const sourcesTracksLeft = () => {
        return JSON.parse(localStorage.getItem("SOURCES_TRACKS"))?.length > 0;
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
        if (!musicControlIsOn()) return;

        console.log("controlling music");

        //todo: queue tracks added for this time period

        if (sourcesTracksLeft()) {
            setTimeout(() => controlMusic(), 30000);
        }
    }


    const stopControlMusic = () => {
        console.log('stopping controlling music');
        localStorage.setItem("MUSIC_CONTROL", "OFF");
    }


   const musicIsScheduledForNow = () => {
        return false;
   }

   
    return { 
        isAlbum, 
        isPlaylist,
        musicIsScheduledForNow,
        spotifyIdFromUri, 
        scheduleMusic,
        getScheduledMusic, 
        unSchedule,
        skipTrack,
        startMusicControl,
        controlMusic, 
        stopControlMusic, 
        times
    }
}

export default spotifyControl;