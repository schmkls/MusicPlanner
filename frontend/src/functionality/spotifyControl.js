import spotifyAccess from "./spotifyAccess"
import axios from "axios";

const spotifyControl = () => {

    const accessor = spotifyAccess();


    const addSource = (sourceLink) => {

    }


    const skipTrack = async() => {
        return new Promise((res, rej) => {
            const accessToken = accessor.getSpotifyAccessToken();
            const postUrl = `https://api.spotify.com/v1/me/player/next`;
            axios.post(postUrl, null, { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                if (response.status < 200 || response.status > 299) return rej("Skip track bad resonse");
                res("Skipped track");
            })
            .catch((err) => {return rej("Skip track error", err)})
        });
    }


    const getNextInPlaylist = async(playlistUri, trackNr) => {

        return new Promise((res, rej) => {
            const accessToken = accessor.getSpotifyAccessToken();
            const playlistId = playlistUri.substr(playlistUri.lastIndexOf(":") + 1);
            axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                //
            })
            .catch((err) => {});
        });
        
    }

    const getNextInAlbum = (albumUri, trackNr) => {

    }



    const readUpcomingTracks = async() => {
        const accessToken = accessor.getSpotifyAccessToken();

        axios.get('https://api.spotify.com/v1/me/player/currently-playing', { headers: { Authorization: `Bearer ${accessToken}`} })
        .then((response) => {
            if (response.status < 200 || response.status > 299) {
                console.log("get currently playing track bad response");
                return;
            }

            console.log("currently playing response: " + JSON.stringify(response, null, 2));

            //console.log("context: " + JSON.stringify(response.data.context, null, 2));

            if (!response.data.context) {
                console.log("cannot read coming tracks, no context available");
                return;
            }

            if (response.data.context.type != "playlist" && response.data.context.type != "album") {
                console.log("cannot read coming tracks, not playing from playlist or album");
                return;
            }

            console.log("number in playlist/album: " + JSON.stringify(response.data.item.track_number));
            console.log("context type: " + JSON.stringify(response.data.context.type));
            console.log("uri of context: " + response.data.context.uri);


            if (response.data.context.type == 'playlist') {
                getNextInPlaylist(response.data.context.uri, response.data.item.track_number);
            }

            if (response.data.context.type == 'album') {
                getNextInAlbum(response.data.context.uri, response.data.item.track_number);
            }

        })
        .catch((err) => {
            console.log("get currently playing track error: " + err);
        });

    }


    /**
     * Keeps tracks in queue that is filtered according to prefered
     * tempo/popularity. 
     */
    const keepFilteredTracksInQueue = () => {

    }
    


    return { 
        addSource,
        readUpcomingTracks,
        skipTrack,
        keepFilteredTracksInQueue
    }
}

export default spotifyControl;