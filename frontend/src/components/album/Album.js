
import axios from "axios";
import { useEffect, useState } from "react";
import spotifyAccess from "../../functionality/spotifyAccess";

/**
 * @param props.albumUri album uri 
 * @returns component displaying album that redirects to album on click
 */
const Album = (props) => {

    const albumId = props.albumUri.substr(props.albumUri.lastIndexOf(":") + 1);
    const [album, setalbum] = useState(null);
    
    const open = () => {
        if (!album) return;
        window.open(album.external_urls.spotify, '_blank').focus();
    }

    useEffect(() => {
        const getUrl = `https://api.spotify.com/v1/albums/${albumId}`;
        const accessToken = spotifyAccess().getSpotifyAccessToken();
        axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("get album bad response");
                return;
            }
            setalbum(response.data);
        })
        .catch((err) => console.log("get album error: ", err));

    }, []);

    return (
        <div>
            <p onClick={() => open()}>
                {album?.name}
            </p>
            <img src={album?.images[0]?.url} width='50' height='50' alt=""/>
        </div>
    )


}

export default Album;