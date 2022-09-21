import axios from 'axios';


const spotifyAccess = () => {

    //variables in localstorage
    const SPOTIFY_ACCESSTOKEN = 'spotify_access_token';
    const SPOTIFY_REFRESHTOKEN = 'spotify_refresh_token';
    const SPOTIFY_TOKEN_TIMEOUT = 'spotify_token_ending_time';

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
     * Localstores timeout for item
     */
    const setTimeOut = (item, validDuration) => {
        const now = new Date().getTime() / 1000; //now in seconds 
        const timeOut = now + validDuration;

        console.log("setting timeout in: ", timeOut - now);
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
                return res(result.data.accessToken);
            })
            .catch((err) => {
                clearAccess();
                return rej(err);
            });
        });
    }


    /**
     * @returns the Spotify access token, refreshed if 
     * it would get invalid in lass than five minutes
     * @param minimumValidMins minimum minutes the token must be valid 
     */
     const getSpotifyAccessToken = (minimumValidMins) => {
        let accessTokenMissing = false;

        //token valid atleast 5 minutes if no other minimum valid time given
        if (!minimumValidMins) {
            minimumValidMins = 5;
        }

        const expirationTime = localStorage.getItem(SPOTIFY_TOKEN_TIMEOUT);
        const accessToken = localStorage.getItem(SPOTIFY_ACCESSTOKEN);

        if (!expirationTime || expirationTime == 'undefined') {
            console.error("warning, no expiration time for access token");
        }  

        const nowInSeconds = new Date().getTime() / 1000;
        const minTimeout = nowInSeconds + minimumValidMins * 60;

        if (!accessToken || accessToken == undefined) {
            console.error('no access token stored');
            accessTokenMissing = true;
        }
    
        //refresh access-token if it is invalid in less than five minutes or no access token at all
        if (expirationTime < minTimeout || accessTokenMissing) {
            console.log("refreshing access-token");

            axios.post('http://localhost:3002/refresh')
            .then((res) => {
                console.log('refreshed token: ' + res.data.accessToken);
                setTimeOut(SPOTIFY_TOKEN_TIMEOUT, res.data.expiresIn);
                localStorage.setItem(SPOTIFY_ACCESSTOKEN, res.data.accessToken);
                return res.data.accessToken;
            })
            .catch((err) => {
                console.log('Could not refresh Spotify access token, clearing access');
                console.log('refresh error: ', err);
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