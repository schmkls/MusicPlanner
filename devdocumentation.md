# Environment variables
* REACT_APP_MUSICPLANNER_SPOTIFY_CLIENT_ID
* REACT_APP_MUSICPLANNNER_SPOTIFY_SECRET


# Localstorage identifiers
*spotify_access_token* Spotify access token needed for making requests to Spotify API
*spotify_refresh_token* token needed for refreshing the access token
*spotify_token_ending_time* when current access token will expire

*VOLUME_CONTROL* if equal to *ON* volume control should be on 
*PREF_VOLUME_[hour]* preferred volume at *hour*

*MUSIC_CONTROL* if equal to *ON* music control should be on 


*SCHEDULED_MUSIC* array of arrays like [[uri, start, end], ...] 
where 
    *uri can be a Spotify uri of playlist or album
    start and end are integers representing start and end hours


*SCHEDULED_TRACKS* array of arrays like [[trackUri, uri, start, end, isPlayed], ...] 
where 
    *trackUri is Spotify track uri
    *uri is uri of album/playlist,j 
    *start and end are integers representing start and end hours 
    *isPlayed is true if track has been added to the queue

