import spotifyAccess from "./spotifyAccess"
import axios from "axios";

const spotifyControl = () => {

    const accessor = spotifyAccess();

    const tempoControlOn = () => {
        return localStorage.getItem('TEMPO_CONTROL') == 'ON';
    }

    const popularityControlOn = () => {
        return localStorage.getItem('POPULARITY_CONTROL') == 'ON';
    }

   
    const isAlbum = (uri) => {
        return (uri.includes(':album:'));
    }


    const isPlaylist = (uri) => {
        return (uri.includes(':playlist:'));
    }

    const spotifyIdFromUri = (uri) => {
        return uri.substring(uri.lastIndexOf(':') + 1);
    }

    //todo
    const addTrackSources = (uri) => {
        
        let tracks = localStorage.getItem('SOURCES_TRACKS') ? JSON.parse(localStorage.getItem('SOURCES_TRACKS')) : [];

        console.log("sources tracks: ", JSON.stringify(tracks));

        let trackUri;
        const accessToken = accessor.getSpotifyAccessToken();
        const id = spotifyIdFromUri(uri);
        if (isPlaylist(uri)) {
            const getUrl = `https://api.spotify.com/v1/playlists/${id}`
            axios.get(getUrl, { headers: { Authorization: `Bearer ${accessToken}`} })
            .then((response) => {
                console.log("in addTrackSources, playlist tracks: ", JSON.stringify(response.data.tracks.items, null, 2))
                
                for (let track in response.data.tracks.items) {
                    console.log("track uri: ", response.data.tracks.items[track].track.uri);
                    trackUri = response.data.tracks.items[track].track.uri;
                    tracks.push({uri, trackUri});    //todo get and add track popularity and tempo
                }
                
                localStorage.setItem('SOURCES_TRACKS', JSON.stringify(tracks));
            })
            .catch((err) => console.log("add track sources error: ", err));
        } 
        
       
    }


    /**
     * @param uri spotify playlist or album uri  
     */
    const addSource = (uri) => {
        console.log("ADDING SOURCE: ", uri);
        if (isAlbum(uri)) {
            let albumSources = JSON.parse(localStorage.getItem("SOURCES_ALBUMS")) ? JSON.parse(localStorage.getItem("SOURCES_ALBUMS")) : [] ;
            albumSources.push(uri);
            localStorage.setItem("SOURCES_ALBUMS", JSON.stringify(albumSources));
        }

        if (isPlaylist(uri)) {
            let playlistSources = JSON.parse(localStorage.getItem("SOURCES_PLAYLISTS")) ? JSON.parse(localStorage.getItem("SOURCES_PLAYLISTS")) : [] ;
            playlistSources.push(uri);
            localStorage.setItem("SOURCES_PLAYLISTS", JSON.stringify(playlistSources));
        }

        addTrackSources(uri);
    }


    //todo
    const deleteSource = (sourceUri) => {
        if (isAlbum(sourceUri)) {
            let albumSources = JSON.parse(localStorage.getItem("SOURCES_ALBUMS"));
            if (!albumSources) return;

            //remove album from array of albums
            let index = albumSources.indexOf(sourceUri);
            if (index !== -1) {
                albumSources.splice(index, 1);
            }
            localStorage.setItem("SOURCES_ALBUMS", JSON.stringify(albumSources, null, 2));
            console.log("albumsources after remove: " + JSON.stringify(albumSources, null, 2));
        }

        if (isPlaylist(sourceUri)) {
            let playlistSources = JSON.parse(localStorage.getItem("SOURCES_PLAYLISTS"));
            if (!playlistSources) return;

            //remove playlist from array of playlists
            let index = playlistSources.indexOf(sourceUri);
            if (index !== -1) {
                playlistSources.splice(index, 1);
            }       
            localStorage.setItem("SOURCES_PLAYLISTS", JSON.stringify(playlistSources, null, 2));
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


    const sourcesTracksLeft = () => {
        return JSON.parse(localStorage.getItem("SOURCES_TRACKS"))?.length > 0;
    }




    /**
     * Keeps tracks in queue that is filtered according to prefered
     * tempo/popularity, from added sources.  
     */
    const controlQueue = () => {
        if (!tempoControlOn() && !popularityControlOn()) {
            return;
        }

        if (sourcesTracksLeft()) {
            setTimeout(() => controlQueue(), 30000);
        }
        
    }


    const turnOnTempoControl = () => {
        localStorage.setItem('TEMPO_CONTROL', 'ON');

        controlQueue();
    }


    const turnOnPopularityControl = () => {
        localStorage.setItem('POPULARITY_CONTROL', 'ON');
        controlQueue();
    }
    

    const turnOffTempoControl = () => {
        localStorage.setItem('TEMPO_CONTROL', 'OFF');
    }

    const turnOffPopularityControl = () => {
        localStorage.setItem('POPULARITY_CONTROL', 'OFF');
    }

    const sourcesAdded = () => {

    }


    return { 
        sourcesTracksLeft, 
        spotifyIdFromUri, 
        addSource,
        deleteSource,
        skipTrack,
        controlQueue,

        turnOnTempoControl, 
        turnOnPopularityControl, 
        turnOffTempoControl,  
        turnOffPopularityControl,
    }
}

export default spotifyControl;