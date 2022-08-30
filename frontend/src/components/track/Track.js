import axios from 'axios';
import { useState, useEffect } from 'react';
import spotifyAccess from '../../functionality/spotifyAccess';

/**
 * @param props.trackId track spotify id 
 * @returns component displaying track that can open track on click
 */
const Track = (props) => {

    const [track, setTrack] = useState();

    
    const makeArtistsString = () => {
        let str = '';

        track?.artists.map((artist, index) => {
            if (index < track.artists.length && index > 0 && track.artists.length > 1) {
                str += ', '
            }

            str += artist.name;
        })

        return str;
    }


    const open = () => {
        //window.location.assign(res.data.body.album.external_urls.spotify);
    }


    useEffect(() => {
        const getUrl = `https://api.spotify.com/v1/tracks/${props.trackId}`;
        const accessToken = spotifyAccess().getSpotifyAccessToken();
        axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("get track bad response");
                return;
            }

            setTrack(response.data);
        })
        .catch((err) => console.log(err));
    }, [props.trackId]);
    

    return (
        <div>
            <hr/>
            <p onClick={() => open()}>
                {track?.name} - {makeArtistsString()}
            </p>
            <img src={track?.album.images[0].url} width='50' height='50' alt=""/>
        </div>
    )
}

export default Track;