import * as spotifyAccessor from "../spotifyAccess";
import * as spotifyController from "../spotifyControl";
import * as musicScheduler from "../musicScheduling";

/**
 * Functionality tests
 */
const tests = () => {

    /**
     * Test that schedule is stored in localStorage. 
     * The album and the tracks in the album should be stored, else test fails. 
     */
    const scheduleAlbumTest = async() => {

        return new Promise(async(res) => {
            console.log('\n\n\n\n\nSCHEDULE ALBUM TEST');

            const uri = 'spotify:album:4D7oCB4QYmLtyYNtJ1atpZ';
            const expectedTrack = 'spotify:track:2VXccDfKpIhjS5yVO2GZOX';

            const thisHr = new Date().getHour();;
            const nextHr = thisHr + 1;
            await musicScheduler.scheduleMusic(uri, thisHr, nextHr)
            .catch((err) => {
                console.error("Test failed: ", err);
                return res();
            })

            let trackIsScheduled = false;
            let scheduledTracks = musicScheduler.getUnplayedScheduledForNow();

            console.log('scheduled tracks: ', scheduledTracks);

            for (let i = 0; i < scheduledTracks.length; i++) {
                if (scheduledTracks[i][0] === expectedTrack && scheduledTracks[i][1] === uri 
                    && scheduledTracks[i][2] === thisHr && scheduledTracks[i][3] === nextHr
                    && scheduledTracks[i][4] === false) {
                        trackIsScheduled = true;
                }
            }
            
            if (!trackIsScheduled) {
                console.error('Test failed, track in album not scheduled');
                return res();
            }
            
            return res();
        });
    }



    const musicControlOnOffTest = () => {
        localStorage.clear();
        spotifyController.startMusicControl();
        if (!spotifyController.musicControlIsOn()) {
            console.error('Test failed, music control should be on');
        };

        spotifyController.stopControlMusic();
        if (spotifyController.musicControlIsOn()) {
            console.error('Test failed, music control should be off');
        }
    }



    const controlMusicTest = async() => {
        const thisHr = new Date().getHours();
        const nextHr = thisHr + 1;


        const uri = 'spotify:album:4D7oCB4QYmLtyYNtJ1atpZ';
        await musicScheduler.scheduleMusic(uri, thisHr, nextHr);
        spotifyController.startMusicControl();
        console.log('CHECK IN SPOTIFY THAT FEATHERYANK IS QUEUED!');
    }

    

    const runTests = async() => {
        //await scheduleAlbumTest();
        //musicControlOnOffTest();
        //controlMusicTest();
    }

    return {
        runTests
    }


}


export default tests;