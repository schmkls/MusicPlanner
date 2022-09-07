
import {React, useState} from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Album from '../album/Album';
import spotifyAccess from '../../functionality/spotifyAccess';
import './SearchAlbum.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';


const SEARCHING = 1;
const NOT_SEARCHING = 2;

const spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken(spotifyAccess().getSpotifyAccessToken(5));

/**
 * @param props.chooseFunc function for choosing album that takes album uri
 * @returns component for searching and choosing a Spotify track
 */
const SearchAlbum = (props) => {

    const [searchStr, setSearchStr] = useState();
    const [albums, setAlbums] = useState();
    const [state, setState] = useState(NOT_SEARCHING);

    const search = () => {
        setAlbums(null);
        setState(SEARCHING);
        spotifyApi.searchAlbums(searchStr)
        .then((data) => {
            setAlbums(data.body.albums.items);
            setState(NOT_SEARCHING);
        })
        .catch((err) => {
            setState(NOT_SEARCHING);
            alert('Could not search');
        });
    }


    return (
        <div>            
            <input placeholder='Search album' onChange={(e) => {
                setSearchStr(e.target.value)
                if (e.target.value.length == 0) {
                    setAlbums(null);
                }
            }}/>
            <button onClick={() => search()}>Search</button>
            {
                albums?.map((album, index) => (
                    <div className='album' key={index}>
                        {
                            <Album albumUri={album.uri} key={index}/>
                        } 
                        <button onClick={() => props.chooseFunc(album.uri)}>
                            Add album to sources
                            <FontAwesomeIcon icon={faCirclePlus}/>
                        </button>
                    </div>
                ))
            }
            {
                state === SEARCHING ? 
                        <h3>Searching...</h3>
                    :
                        <></>

            }
            <hr/>
        </div>
    )
}

export default SearchAlbum;