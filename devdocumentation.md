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


*SCHEDULED_MUSIC* list of tuples like [(uri, start, end), (uri, start, end), ...] 
where 
    *uri can be a Spotify uri of playlist or album
    start and end are integers representing start and end hours


*SCHEDULED_TRACKS* list of tuples like [(uri, trackUri, start, end, isPlayed), ...] 
where 
    *uri is uri of album/playlist,j 
    *trackUri is Spotify track id
    *start and end are integers representing start and end hours 
    *isPlayed is true if track has been added to the queue

