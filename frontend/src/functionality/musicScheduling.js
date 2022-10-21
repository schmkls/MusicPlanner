import * as spotifyController from "./spotifyControl";

const SCHEDULED_MUSIC = 'SCHEDULED_MUSIC';
const SCHEDULED_TRACKS = 'SCHEDULED_TRACKS';
export const times = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3];   



/**
 * @param uri spotify playlist or album uri  
 * @param start start time in hours (float), like 23.5 (for 23:30)
 * @param end end time
 * @param id used to identify scheduled period, should be unique
 */
export const scheduleMusic = (uri, start, end, id) => {
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
 
}


export const getScheduledMusic = () => {
    let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) ? JSON.parse(localStorage.getItem(SCHEDULED_MUSIC)) : [] ;
    return scheduled;
}


const getTimeNow = () => {
    const now = new Date();
    let fullHr = now.getHours();
    let hrPart = now.getMinutes() / 60;
    return fullHr + hrPart;
}


/** 
 * @returns scheduled music for now (see devdocumentation.md)
 */
export const getScheduledForNow = () => {
    let now = getTimeNow();
    let scheduled = getScheduledMusic();
    console.log('all scheduled: ', scheduled);
    return scheduled.filter(function(sch) {
        return sch[1] > now && sch[2] < now;
    });
}


export const unSchedule = (id) => {
    let scheduled = getScheduledMusic();
    if (!scheduled) return;

    scheduled = scheduled.filter(function(sch) {
        return sch[3] !== id;
    })

    localStorage.setItem(SCHEDULED_MUSIC, JSON.stringify(scheduled));
}


export const makeUniqueId = (uri) => {
    return (uri + new Date().getTime());
}


export const musicIsScheduledForNow = () => {
    let scheduled = getScheduledForNow();
    return scheduled.length > 0;
}


