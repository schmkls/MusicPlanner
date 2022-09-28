const SCHEDULED_MUSIC = 'SCHEDULED_MUSIC';
const SCHEDULED_TRACKS = 'SCHEDULED_TRACKS';
const times = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3];   


const musicScheduling = () => {

    
    //todo: gör inga Spotify grejer

    /**
     * Schedules tracks of album or playlist
     * 
     * @param uri Spotify uri of playlist/album
     * @param start from when track is scheduled (integer)
     * @param end to what hour track is scheduled (integer)
     */
    /*
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
    }*/


    /**
     * @param uri spotify playlist or album uri  
     * @param start start time in hours (float), like 23.5 (for 23:30)
     * @param end end time
     * @param id used to identify scheduled period, should be unique
     */
    const scheduleMusic = (uri, start, end, id) => {
        console.log("SCHEDULING: ", uri, "from ", start, " to ", end, " with id: ", id);
    
        let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) ? JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) : [] ;

        let rescheduling = false;
        for (let i = 0; i < scheduled.length; i++) {
            if (scheduled[i][3] === id) {
                scheduled[i] = [uri, start, end, id];
                rescheduling = true;
                break;
            }
        }

        if (!rescheduling) {
            scheduled.push([uri, start, end, id]);
        }
        
        localStorage.setItem(SCHEDULED_MUSIC, JSON.stringify(scheduled));
        //addScheduledTracks(uri, start, end);
    }
    

    const getScheduledMusic = () => {
        let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) ? JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) : [] ;
        return scheduled;
    }


    //todo
    const unSchedule = (id) => {
        
        let scheduled = getScheduledMusic();

        if (!scheduled) return;

        scheduled = scheduled.filter(function(sch) {
            return sch[3] !== id;
        })


        localStorage.setItem(SCHEDULED_MUSIC, JSON.stringify(scheduled));
        //console.log("scheduled after unscheduling", uri, ": " + JSON.stringify(scheduled, null, 2));

    }

    const makePeriodUniqueId = (uri) => {
        return (uri + new Date().getTime());
    }


    const sourcesTracksLeft = () => {
        return JSON.parse(localStorage.getItem("SOURCES_TRACKS"))?.length > 0;
    }

    const musicIsScheduledForNow = () => {
        return false;
    }

    return {
        musicIsScheduledForNow,
        makePeriodUniqueId,
        scheduleMusic,
        getScheduledMusic, 
        unSchedule,
        times
    }


}

export default musicScheduling;