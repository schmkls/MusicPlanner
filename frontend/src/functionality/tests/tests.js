import spotifyAccess from "../spotifyAccess";
import spotifyControl from "../spotifyControl";
import musicScheduling from "../musicScheduling";

/**
 * Functionality tests
 */
const tests = () => {

    const spotifyAccessor = spotifyAccess();
    const spotifyController = spotifyControl();
    const musicScheduler = musicScheduling();


    const scheduleAlbumTest = async() => {
        console.log('\n\n\n\n\nSCHEDULE ALBUM TEST');

        const uri = 'spotify:album:4D7oCB4QYmLtyYNtJ1atpZ';
        const expectedTrack = 'spotify:track:2VXccDfKpIhjS5yVO2GZOX';

        const start = 11.5;
        const end = 23.45;
        await musicScheduler.scheduleMusic(uri, start, end)
        .catch((err) => {
            console.error("Test failed: ", err);
            return;
        })

        const scheduled = musicScheduler.getScheduledMusic();
        
        let sourceIsScheduled = false;
        

        for (let i = 0; i < scheduled.length; i++) {
            if (scheduled[i][0] === uri && scheduled[i][1] === start && scheduled[i][2] === end) {
                sourceIsScheduled = true;
                break;
            }
        }

        if (!sourceIsScheduled) {
            console.error('Test failed, album not scheduled');
            return;
        }


        let trackIsScheduled = false;
        let scheduledTracks = musicScheduler.getScheduledTracks();

        console.log('scheduled tracks: ', scheduledTracks);

        for (let i = 0; i < scheduledTracks.length; i++) {
            if (scheduledTracks[i][0] === expectedTrack && scheduledTracks[i][1] === uri 
                && scheduledTracks[i][2] === start && scheduledTracks[i][3] === end
                && scheduledTracks[i][4] === false) {
                    trackIsScheduled = true;
            }
        }
        
        if (!trackIsScheduled) {
            console.error('Test failed, track in album not scheduled');
            return;
        }

        console.log('TEST PASSED!');
        
    }




    const runTests = () => {
        scheduleAlbumTest();
    }

    return {
        runTests
    }


}


export default tests;