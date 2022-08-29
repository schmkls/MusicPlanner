import axios from 'axios';


const spotifyAccess = () => {

    //variables in localstorage
    const SPOTIFY_ACCESSTOKEN = 'spotify_access_token';
    const SPOTIFY_REFRESHTOKEN = 'spotify_refresh_token';
    const SPOTIFY_TOKEN_TIMEOUT = 'spotify_token_ending_time';

    console.log("client id: " + process.env.REACT_APP_MUSICPLANNER_SPOTIFY_CLIENT_ID);


    const makeRandomString = (length) => {
        var result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
    
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    }


    const clearAccess = () => {
        localStorage.removeItem(SPOTIFY_ACCESSTOKEN);
        localStorage.removeItem(SPOTIFY_REFRESHTOKEN);
        localStorage.removeItem(SPOTIFY_TOKEN_TIMEOUT);
    }


    /**
     * Localstores timeout for access token
     */
    const setTimeOut = (item, validDuration) => {
        const now = new Date().getTime() / 1000; //now in seconds 
        const timeOut = now + validDuration;
        localStorage.setItem(item, timeOut);
    }


    /**
     * Authorizes Spotify user,
     * localstores users Spotify-id
     * localstores Spotify access-token
     * @param {*} code 
     * @returns 
     */
    const authorizeSpotify = (code) => {
        console.log('authorizing Spotify');
        return new Promise((res, rej) => {
            axios.post('http://localhost:3002/login', {
                code: code
            })
            .then((result) => {
                if (result.status < 200 || result.status > 299) {
                    console.log('spotify authorize error, response: ' + JSON.stringify(res));
                    localStorage.clear(SPOTIFY_ACCESSTOKEN);
                    localStorage.clear(SPOTIFY_REFRESHTOKEN);
                    localStorage.clear(SPOTIFY_TOKEN_TIMEOUT);
                    return rej();
                }

                localStorage.setItem(SPOTIFY_ACCESSTOKEN, result.data.accessToken);
                setTimeOut(SPOTIFY_TOKEN_TIMEOUT, result.data.expiresIn);                    
                res(result.data.accessToken);
            })
            .catch((err) => {
                rej(err);
            });
        });
    }


    /**
     * @returns the Spotify access token, refreshed if 
     * it would get invalid in lass than five minutes
     * @param minimumValidMins minimum minutes the token must be valid 
     */
     const getSpotifyAccessToken = (minimumValidMins) => {
        const expirationTime = localStorage.getItem(SPOTIFY_TOKEN_TIMEOUT);
        if (!expirationTime || expirationTime == 'undefined') {
            
        }  

        const nowInSeconds = new Date().getTime() / 1000;
        const minTimeout = nowInSeconds + minimumValidMins * 60;


        const accessToken = localStorage.getItem(SPOTIFY_ACCESSTOKEN);

        if (!accessToken || accessToken == undefined) {
            console.log('no access token stored');
            return null;
        }
        

        //refresh access-token if it is invalid in less than five minutes
        if (expirationTime < minTimeout) {
            axios.post('http://localhost:3002/refresh')
            .then((res) => {
                console.log('refreshed token: ' + res.data.accessToken);
                setTimeOut(SPOTIFY_TOKEN_TIMEOUT, res.data.expiresIn);
                localStorage.setItem(SPOTIFY_ACCESSTOKEN, res.data.accessToken);
            })
            .catch((err) => {
                console.log('Could not refresh Spotify access token, clearing access');
                console.log('refresh error: '  + err);
                clearAccess();
            });
        } else {
            return localStorage.getItem(SPOTIFY_ACCESSTOKEN);            
        }

        
    }

    return {
        authorizeSpotify,
        getSpotifyAccessToken, 
        clearAccess
    }

}

export default spotifyAccess;