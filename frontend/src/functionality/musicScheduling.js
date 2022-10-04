import * as spotifyController from "./spotifyControl";

const SCHEDULED_MUSIC = 'SCHEDULED_MUSIC';
const SCHEDULED_TRACKS = 'SCHEDULED_TRACKS';
export const times = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3];   


/**
 * Schedules tracks of album or playlist
 * 
 * @param uri Spotify uri of playlist/album
 * @param start from when track is scheduled (integer)
 * @param end to what hour track is scheduled (integer)
 */
const scheduleTracks = async(uri, start, end) => {
    return new Promise((res, rej) => {

        console.log("scheduling tracks of: ", uri);
        let scheduledTracks = localStorage.getItem(SCHEDULED_TRACKS) ? JSON.parse(localStorage.getItem(SCHEDULED_TRACKS)) : [];

        if (spotifyController.isAlbum(uri)) {
            spotifyController.getTracksInAlbum(uri)
            .then((tracks) => {
                console.log("tracks in album: ", tracks);
                for (let i = 0; i < tracks.length; i++) {
                    scheduledTracks.push([tracks[i], uri, start, end, false]);
                }
                localStorage.setItem(SCHEDULED_TRACKS, JSON.stringify(scheduledTracks));
                return res("tracks scheduled");
            })
            .catch((err) => {
                console.error("Could not schedule tracks, ", err);
                return rej("Could not schedule tracks: ", err);
            });
        }


        else if (spotifyController.isPlaylist(uri)) {
            spotifyController.getTracksInPlaylist(uri)
            .then((tracks) => {
                console.log("tracks in album: ", tracks);
                for (let i = 0; i < tracks.length; i++) {
                    scheduledTracks.push([tracks[i], uri, start, end, false]);
                }
                localStorage.setItem(SCHEDULED_TRACKS, JSON.stringify(scheduledTracks));
                return res("tracks scheduled");
            })
            .catch((err) => {
                console.error("Could not schedule tracks, ", err);
                return rej("Could not schedule tracks: ", err);
            });
        }

        else {
            return rej("uri neither playlist or album");
        }
    });

    
}


/**
 * @param uri spotify playlist or album uri  
 * @param start start time in hours (float), like 23.5 (for 23:30)
 * @param end end time
 * @param id used to identify scheduled period, should be unique
 */
export const scheduleMusic = async(uri, start, end, id) => {
    console.log("SCHEDULING: ", uri, "from ", start, " to ", end, " with id: ", id);

    return new Promise(async(res, rej) => {
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
        scheduleTracks(uri, start, end)
        .then(() => { return res("music scheduled successfully")})
        .catch((err) => { return rej(err) });
    });
}



export const getScheduledMusic = () => {
    let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) ? JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) : [] ;
    return scheduled;
}

const getScheduledTracks = () => {
    let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_TRACKS)) ? JSON.parse(localStorage.getItem(SCHEDULED_TRACKS)) : [] ;
    return scheduled;
}

const getTimeNow = () => {
    const now = new Date();
    let fullHr = now.getHours();
    let hrPart = now.getMinutes() / 60;
    return fullHr + hrPart;
}

const getScheduledForNow = () => {
    let now = getTimeNow();
    let scheduled = getScheduledMusic();
    return scheduled.filter(function(sch) {
        return sch[2] > now && sch[3] < now;
    });
}

export const getUnplayedScheduledForNow = () => {
    let scheduledNow = getScheduledForNow();
    return scheduledNow.filter(function(sch) {
            return !sch[4];
    });
}

export const getPlayedScheduledForNow = () => {
    let scheduledNow = getScheduledForNow();
    
    return scheduledNow.filter(function(sch) {
        return sch[4];
    });
}


//todo: unschedule tracks also
export const unSchedule = (id) => {
    
    let scheduled = getScheduledMusic();

    if (!scheduled) return;

    scheduled = scheduled.filter(function(sch) {
        return sch[3] !== id;
    })


    localStorage.setItem(SCHEDULED_MUSIC, JSON.stringify(scheduled));
    //console.log("scheduled after unscheduling", uri, ": " + JSON.stringify(scheduled, null, 2));

}


export const makeUniqueId = (uri) => {
    return (uri + new Date().getTime());
}


export const musicIsScheduledForNow = () => {

    //todo: check that there is unplayed scheduled music left
    return false;
}

/**
 * @param played played scheduled track, like: [[trackUri, uri, start, end, isPlayed]  
 */
export const markPlayed = (played) => {
    let scheduled = getScheduledTracks();
    for (let i = 0; i < played.length; i++) {
        if (scheduled[i] === played[i]) {
            console.log("marking ", scheduled[i], " as played");
            scheduled[i][4] = true;
        }
    }

    localStorage.setItem(SCHEDULED_TRACKS, JSON.stringify(scheduled));
}
