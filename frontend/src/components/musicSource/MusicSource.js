import axios from "axios";
import { useEffect, useState } from "react";
import * as spotifyAccessor from "../../functionality/spotifyAccess";
import * as spotifyController from "../../functionality/spotifyControl";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import './MusicSource.css';

const ALBUM = "album";
const PLAYLIST = "playlist";
const INVALID = "invalid";

/**
 * Clickable display of music source (album or playlist). 
 * 
 * 
 * @param props.uri 
 * @param props.minimal if true the MusicSource will be as small as possible
 */
 const MusicSource = (props) => {

    let type;
    const id = spotifyController.spotifyIdFromUri(props.uri);
    const [source, setSource] = useState(null);


    if (spotifyController.isAlbum(props.uri)) {
        type = ALBUM;
    } 
    else if (spotifyController.isPlaylist(props.uri)) {
        type = PLAYLIST;
    }
    else {
        console.error("Invalid source, must be playlist or album");
        type = INVALID;
    }

    
    const open = () => {
        if (!source) return;

        window.open(source.external_urls.spotify, '_blank').focus();
    }


    useEffect(() => {
        if (type === INVALID) return;

        const getUrl = 
                type === PLAYLIST ? `https://api.spotify.com/v1/playlists/${id}` :
                type === ALBUM ? `https://api.spotify.com/v1/albums/${id}` :
                null;

        const accessToken = spotifyAccessor.getSpotifyAccessToken();
        axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("get playlist bad response");
                return;
            }

            setSource(response.data);
        })
        .catch((err) => console.log("get playlist error: ", err));

    }, [id, type]);

    if (type === INVALID) {
        return (
            <p>Something went wrong</p>
        )
    }

    return (
        <div className={props.minimal ? 'minimal' : 'outmost'}>
            <p onClick={() => open()}>
                {source?.name}
            </p>
            <div className='imageContainer'>
                <img src={source?.images[0]?.url} width='50' height='50' alt=""/>
            </div>
            {
                props.closeable ? 
                    <button onClick={() => props.onClose()} className="closeBtn">
                        <FontAwesomeIcon icon={faWindowClose}/>
                    </button>
                :
                    <></>
            }

            
        </div>
    )


}

export default MusicSource;