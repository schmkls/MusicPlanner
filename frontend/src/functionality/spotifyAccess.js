var SpotifyWebApi = require('spotify-web-api-node');


const spotifyAccess = () => {

    //variables in localstorage
    const SPOTIFY_ACCESSTOKEN = 'spotify_access_token';
    const SPOTIFY_REFRESHTOKEN = 'spotify_refresh_token';
    const SPOTIFY_TOKEN_TIMEOUT = 'spotify_token_ending_time';

    
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000/login',
        clientId: process.env.MUSICPLANNER_SPOTIFY_CLIENT_ID,
        clientSecret: process.env.MUSICPLANNER_SPOTIFY_CLIENT_SECRET
    });


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
     * localstores Spotify access token
     * @param code 
     * @returns promise with access token 
     */
     const authorizeSpotify = (code) => {
        console.log('authorizing Spotify');
        return new Promise((res, rej) => {
            spotifyApi.authorizationCodeGrant(code)
            .then((response) => {
                spotifyApi.setAccessToken(response.body.access_token);
                localStorage.setItem(SPOTIFY_ACCESSTOKEN, response.body.access_token);

                spotifyApi.setRefreshToken(response.body.refresh_token);
                setTimeOut(SPOTIFY_TOKEN_TIMEOUT, response.body.expires_in);     
            })
            .catch(err => {
                console.log("authorize error: " + JSON.stringify(err));
                clearAccess();
            })
        });
    }


    /**
     * @returns the Spotify access token, refreshed if 
     * it would get invalid in lass than five minutes
     * @param minimumValidMins minimum minutes the token must be valid 
     */
     const getSpotifyAccessToken = (minimumValidMins) => {
        const expirationTime = localStorage.getItem(SPOTIFY_TOKEN_TIMEOUT);
        const accessToken = localStorage.getItem(SPOTIFY_ACCESSTOKEN);

        const nowInSeconds = new Date().getTime() / 1000;
        const minTimeout = nowInSeconds + minimumValidMins * 60;
        
        if (!expirationTime || expirationTime == 'undefined') {
            console.log("no expiration time stored for spotify access token");
        }  

        if (!accessToken || accessToken == undefined) {
            console.log('no access token stored');
            return null;
        }

        if (expirationTime > minTimeout) {
            return localStorage.getItem(SPOTIFY_ACCESSTOKEN);            
        }
        

        //refresh access-token if it will be invalid in less than five minutes
        if (expirationTime < minTimeout) {
            spotifyApi.refreshAccessToken()
            .then((response) => {
                setTimeOut(SPOTIFY_TOKEN_TIMEOUT, response.body.expires_in);
                localStorage.setItem(SPOTIFY_ACCESSTOKEN, response.body.access_token);
            })
            .catch((err) => {
                console.log('Could not refresh Spotify access token. Removing access. Error: ', err);
                clearAccess();
            });
        }
    }

    return {
        authorizeSpotify,
        getSpotifyAccessToken, 
        clearAccess
    }

}

export default spotifyAccess;