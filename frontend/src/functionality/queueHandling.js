import spotifyControl from "./spotifyControl";
import musicScheduling from "./musicScheduling";

//sessionStorage-identifier for tracks (spotify track uris) that has been enqueued
const ENQ_TRACKS = 'enqueuedTracks';   
const PREF_QUEUE_SIZE = 5;

/**
 * Used for keeping tracks in queue.  
 */
const queueHandling = () =>{

    const spotifyController = spotifyControl();
    const musicScheduler = musicScheduling();
    

    //gets enqueued tracks from sessionStorage
    const getEnqueuedTracks = () => {
        const enqueued = JSON.parse(sessionStorage.getItem(ENQ_TRACKS));
        if (enqueued) {
            return enqueued;
        }

        return [];
    }

    const countProps = (obj) => {
        var count = 0;
        for (var p in obj) {
          obj.hasOwnProperty(p) && count++;
        }
        return count; 
    }

    //stores enqueued track in sessionStorage
    const sessionEnqueue = (trackUri) => {
        let enqueued = getEnqueuedTracks();
        enqueued.push(trackUri);
        sessionStorage.setItem(ENQ_TRACKS, JSON.stringify(enqueued));
    }



    //returns the tracks that has not been queued
    const getNonEnqueued = (uris) => {  
        const queued = getEnqueuedTracks();

        return uris.filter(function(uri) {
            return (!queued.includes(uri));
        });
    }


    //returns the probable size of Spotify queue based on current track and enqueued tracks
    const getQueueSize = () => {
        return new Promise((res, rej) => {
            spotifyController.getPlayingTrack()
            .then((curr) => {
                const enqueued = getEnqueuedTracks();
                const totEnq = countProps(enqueued);

                const index = enqueued.indexOf(curr);

                if (index === -1) {
                    return res(totEnq);
                } else {
                    return res(totEnq - index - 1);
                }
            })
            .catch((err) => {
                console.log('get queue size error: ' + err)
                return rej()
            });
        })
    }

    /**
     * Makes sure PREF_QUEUE_SIZE number of tracks is kept in queue, 
     * may fill queue with tracks from @param tracks, and lets musicScheduler know 
     * they have been played. 
     * 
     * @param tracks array of tracks like [[trackUri, uri, start, end, isPlayed], ...]  
     */
    const fillQueue = (tracks) => {
        console.log("queueHandler filling queue with: ", tracks);

        let diff = PREF_QUEUE_SIZE - getQueueSize();
        for (let i = 0; i < diff; i++) {
            //queue a random track amongs tracks
            //mark as played
        } 

    }


    return {
        fillQueue
    }

}

export default queueHandling;

