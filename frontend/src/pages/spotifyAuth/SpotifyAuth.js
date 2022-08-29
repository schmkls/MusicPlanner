import {React, useState} from 'react';
import axios from 'axios';
import navigate from '../../functionality/navigate';
import spotifyAccess from '../../functionality/spotifyAccess';

const FAIL = -1;
const clientId = 'fbf03b6da2bd4da1a0a5ae1905d8ee4b';

/**
 * @returns page with alternative to login and create new user
 */
const SpotifyAuth = (props) => {

    const navigator = navigate();
    const spotifyAccessor = spotifyAccess();
    var authorizing = false;

    //where to direct after login 
    const redirectUrl = navigator.getURL(navigator.pages.authRedirect);

    const AUTH_URL = `https://accounts.spotify.com/en/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&scope=streaming%20user-read-email%20user-read-private%20user-modify-playback-state%20user-read-recently-played%20user-read-playback-state%20user-modify-playback-state`;

    const code = new URLSearchParams(window.location.search).get('code');

    if (code && code !== 'undefined') {
        authorizing = true;
        spotifyAccessor.authorizeSpotify(code)
        .then((accessToken) => {
            //navigate to login page
            window.location.href = navigator.getURL(navigator.pages.authRedirect);
        })
        .catch((err) => {
            console.log('authorizeError: ' + err);
            authorizing = FAIL;
        });
    }

    if (authorizing === true) {
        return (
            <div>
                <h2>Authorizing...</h2>
            </div>
        )
    }

    if (authorizing === FAIL) {
        return (
            <div>
                <h2>Authorizing failed</h2>
            </div>
        )
    }

    return (
        <div>
            <h2>Welcome to MusicPlanner!</h2>
            <hr/>
            <h6>Authorize Spotify in order to plan music!</h6>
            <div className='btn-group' role='group' aria-label='Basic example'>
                <button type='button' className='btn btn-secondary' onClick={() => window.location.href = AUTH_URL}>Connect with Spotify</button>
            </div>
            <img src='./spotify_logo.svg' width='300' alt=''/>
        </div>
    )
}

export default SpotifyAuth;