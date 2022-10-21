import * as spotifyAccessor from "../spotifyAccess";
import * as spotifyController from "../spotifyControl";
import * as musicScheduler from "../musicScheduling";

/**
 * Functionality tests
 */
const tests = () => {

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
        musicScheduler.scheduleMusic(uri, thisHr, nextHr);
        spotifyController.startMusicControl();
        console.log('CHECK IN SPOTIFY THAT FEATHERYANK IS QUEUED!');
    }

    

    const runTests = async() => {
        //await scheduleAlbumTest();
        //musicControlOnOffTest();
        controlMusicTest();
    }

    return {
        runTests
    }


}


export default tests;