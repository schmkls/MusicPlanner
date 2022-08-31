import axios from "axios";
import { useEffect, useState } from "react";
import spotifyAccess from "../../functionality/spotifyAccess";

/**
 * @param props.playlistUri playlist uri 
 * @returns component displaying playlist that redirects to playlist on click
 */
const Playlist = (props) => {

    const playlistId = props.playlistUri.substr(props.playlistUri.lastIndexOf(":") + 1);
    const [playlist, setPlaylist] = useState(null);
    
    const open = () => {
        if (!playlist) return;
        window.open(playlist.external_urls.spotify, '_blank').focus();
    }

    useEffect(() => {
        const getUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;
        const accessToken = spotifyAccess().getSpotifyAccessToken();
        axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("get playlist bad response");
                return;
            }

            setPlaylist(response.data);
        })
        .catch((err) => console.log("get playlist error: ", err));

    }, []);

    return (
        <div>
            <p onClick={() => open()}>
                {playlist?.name}
            </p>
            <img src={playlist?.images[0]?.url} width='50' height='50' alt=""/>
        </div>
    )


}

export default Playlist;