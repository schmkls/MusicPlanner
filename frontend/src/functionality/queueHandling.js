import * as spotifyController from "./spotifyControl";
import * as musicScheduler from "./musicScheduling";


//identifiers
const ENQ_TRACKS = 'ENQUEUED_TRACKS';   //tracks that has been enqueued
const PLAYED_INDEX = 'PLAYED_INDEX';     //best guess of index of played tracks


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


//gets index of last played tracks amongs enqueued tracks (may update index first)
const updatePlayedIndex = async() => {
    
    let index = localStorage.getItem(PLAYED_INDEX);
    let enqueued = getEnqueuedTracks();
    let playingTrack = await spotifyController.getPlayingTrack();

    if (playingTrack) {
        for (let i = index; i < enqueued.length; i++) {
            if (enqueued[i] == playingTrack) {
                index = i;
                break;
            }
        }
    }

    localStorage.setItem(PLAYED_INDEX, index);
}


const getQueueSize = () => {
    let enqueued = JSON.parse(localStorage.getItem(ENQ_TRACKS));
    let playedIndex = JSON.parse(localStorage.getItem(PLAYED_INDEX));

    if (!enqueued) return 0;
    if (!playedIndex) return enqueued.length;

    return enqueued.length - playedIndex;
}


//gets enqueued tracks from localStorage
const getEnqueuedTracks = () => {
    const enqueued = JSON.parse(localStorage.getItem(ENQ_TRACKS));
    if (enqueued) {
        return enqueued;
    }

    return [];
}

/**
 * Makes sure PREF_QUEUE_SIZE number of tracks is kept in queue, 
 * may fill queue with tracks from @param tracks, and lets musicScheduler know 
 * they have been played. 
 * 
 * @param tracks Spotify-uris of tracks
 */
export const fillQueue = (tracks) => {
    console.log("queueHandler filling queue with: ", tracks);

    let diff = PREF_QUEUE_SIZE - getQueueSize();

    console.log('queue size: ', getQueueSize());

    console.log('should queue ' + diff + ' tracks');

    //todo: köa i första hand längesedan spelade 
    for (let i = 0; i < diff; i++) {
        spotifyController.enqueueTrack(tracks[i])
        .catch((err) => console.log("Could not fill queue", err));
        markQueued(tracks[i]);
    } 

    updatePlayedIndex();
}
