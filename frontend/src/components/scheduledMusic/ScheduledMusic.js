import { useState, useEffect } from "react";
import spotifyControl from "../../functionality/spotifyControl";


/**
 * Display music scheduled for now and upcoming music. 
 */
const ScheduledMusic = () => {  

    const [scheduledNow, setScheduledNow] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    const spotifyController = spotifyControl();

    useEffect(() => {
        
    });


    return (
        <div>
            <h2>Scheduled music: </h2>
        </div>
    )

}

export default ScheduledMusic;