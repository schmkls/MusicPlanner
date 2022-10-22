import * as spotifyController from "./spotifyControl";


//identifiers
const ENQ_TRACKS = 'ENQUEUED_TRACKS';   //tracks that has been enqueued


const PREF_QUEUE_SIZE = 5;




const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Timeout!");
    }, 4000);
});


const countProps = (obj) => {
    var count = 0;
    for (var p in obj) {
        obj.hasOwnProperty(p) && count++;
    }
    return count; 
}


//stores enqueued track in localStorage
const markQueued = (trackUri) => {
    let enqueued = getEnqueuedTracks();
    enqueued.push(trackUri);
    localStorage.setItem(ENQ_TRACKS, JSON.stringify(enqueued));
}

/**
 * Update which tracks has been played or are still in queue. 
 */
const updateEnqueued = () => {
    let queue = getEnqueuedTracks();
    let playingUri = spotifyController.getPlayingTrack();

    //todo: markera fram till nuvarande spelande som played

}

//gets enqueued tracks from localStorage
const getEnqueuedTracks = () => {
    const enqueued = JSON.parse(localStorage.getItem(ENQ_TRACKS));
    if (enqueued) {
        return enqueued;
    }
    
    return [];
}

const getQueueSize = () => {
    return getEnqueuedTracks().length - getPlayedTracks().length;
}


/**
 * returns enqueued and played tracks in order most recently played to least recently played
 */
const getPlayedTracks = () => {
    let enqueued = getEnqueuedTracks();

    let played = enqueued.filter((track) => {
        return track[1] === 'true';
    });

    return played;
}


/**
 * Makes sure PREF_QUEUE_SIZE number of tracks is kept in queue, 
 * may fill queue with tracks from @param tracks, and lets musicScheduler know 
 * they have been played. 
 * 
 * @param tracks Spotify-uris of tracks
 */
export const fillQueue = (tracks) => {
    let queueProspects = Array.from(tracks);
    
    console.log("queueHandler filling queue with: ", tracks);

    let diff = PREF_QUEUE_SIZE - getQueueSize();

    console.log('queue size: ', getQueueSize());
    console.log('should queue ' + diff + ' tracks');

    let playedTracks = getPlayedTracks();
    let playedUris = [];

    for (let i = 0; i < playedTracks.length; i++) {
        playedUris.push(playedTracks[i][0]);
    }


    let j = 0;
    while (queueProspects.length >= diff) {
        if (playedUris.includes(queueProspects[j])) {
            queueProspects.splice(j, 1);
        }
        j++;
    }

    //todo: köa i första hand längesedan spelade 
    for (let i = 0; i < diff; i++) {
        spotifyController.enqueueTrack(tracks[i])
        .catch((err) => console.log("Could not fill queue", err));
        markQueued(tracks[i]);
    } 
}
