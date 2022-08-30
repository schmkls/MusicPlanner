import axios from "axios";
import { useEffect, useState } from "react";
import Track from "../track/Track";
import spotifyAccess from "../../functionality/spotifyAccess";

/**
 * Display currently playing track
 */
const Playing = () => {

    const [currPlaying, setCp] = useState(null);
    const spotifyAccessor = spotifyAccess();

    const getCurrPlaying = async() => {

        
        
    }


    useEffect(() => {
        const accessToken = spotifyAccessor.getSpotifyAccessToken();

            axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                if (response.status < 200 || response.status > 299) {
                    console.log("get currently playing track bad response");
                    return;
                }

                if (!response.data.item || !response.data.item.id) {
                    setCp(null);
                    return;
                }
            
                setCp(response.data.item.id);
            })
            .catch((err) => {
                console.log("get currently playing track error: " + err);
            });
      
    }, []);



    return (
        <div>
            <br/>
            <h2>Currently playing: </h2>
            {
                currPlaying != null ? 
                    <Track trackId={currPlaying}/>
                :
                    <></>
            }
            
            <br/>
        </div>
    )
}

export default Playing;