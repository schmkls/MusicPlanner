import spotifyAccess from "./spotifyAccess"
import axios from "axios";

const spotifyControl = () => {

    const accessor = spotifyAccess();


    const isAlbum = (uri) => {
        return (uri.includes(':album:'));
    }


    const isPlaylist = (uri) => {
        return (uri.includes(':playlist:'));

    }

    const addSource = (sourceUri) => {

        if (isAlbum(sourceUri)) {
            let albumSources = JSON.parse(localStorage.getItem("ALBUM_SOURCES")) ? JSON.parse(localStorage.getItem("ALBUM_SOURCES")) : [] ;
            albumSources.push(sourceUri);
            localStorage.setItem("ALBUM_SOURCES", JSON.stringify(albumSources, null, 2));
            console.log("albumsources after push: " + JSON.stringify(albumSources, null, 2));
            console.log("actual albumsources after push: " + JSON.parse(localStorage.getItem("ALBUM_SOURCES")));
        }

        if (isPlaylist(sourceUri)) {
            let playlistSources = JSON.parse(localStorage.getItem("PLAYLIST_SOURCES")) ? JSON.parse(localStorage.getItem("PLAYLIST_SOURCES")) : [] ;
            playlistSources.push(sourceUri);
            localStorage.setItem("PLAYLIST_SOURCES", JSON.stringify(playlistSources, null, 2));
            console.log("playlistsources after push: " + JSON.stringify(playlistSources, null, 2));
        }

        console.log("source to add: " + sourceUri);
    }



    const deleteSource = (sourceUri) => {
        if (isAlbum(sourceUri)) {
            let albumSources = JSON.parse(localStorage.getItem("ALBUM_SOURCES"));
            if (!albumSources) return;

            //remove album from array of albums
            let index = albumSources.indexOf(sourceUri);
            if (index !== -1) {
                albumSources.splice(index, 1);
            }
            localStorage.setItem("ALBUM_SOURCES", JSON.stringify(albumSources, null, 2));
            console.log("albumsources after remove: " + JSON.stringify(albumSources, null, 2));
        }

        if (isPlaylist(sourceUri)) {
            let playlistSources = JSON.parse(localStorage.getItem("PLAYLIST_SOURCES"));
            if (!playlistSources) return;

            //remove playlist from array of playlists
            let index = playlistSources.indexOf(sourceUri);
            if (index !== -1) {
                playlistSources.splice(index, 1);
            }       
            localStorage.setItem("PLAYLIST_SOURCES", JSON.stringify(playlistSources, null, 2));
            console.log("playlistsources after remove: " + JSON.stringify(playlistSources, null, 2));
        }
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
        console.log("keeping filtered tracks in queue");

        //om antal i kö < 3
        //hämta 3stk random från sources som uppfyller filtreringskrav, lägg till i kö, ta bort från sources

        if (localStorage.getItem('TEMPO_CONTROL' == 'ON') || localStorage.getItem('POPULARITY_CONTROL' == 'ON')) {
            setTimeout(() => keepFilteredTracksInQueue(), 6000);
        }

    }


    const enableTempoControl = () => {
        localStorage.setItem('TEMPO_CONTROL', 'ON');
    }

    const disableTempoControl = () => {
        localStorage.setItem('TEMPO_CONTROL', 'OFF');

    }
    


    return { 
        addSource,
        deleteSource,
        readUpcomingTracks,
        skipTrack,
        keepFilteredTracksInQueue
    }
}

export default spotifyControl;