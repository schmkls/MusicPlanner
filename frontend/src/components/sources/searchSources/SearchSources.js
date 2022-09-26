
import {React, useState} from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import MusicSource from '../../musicSource/MusicSource';
import spotifyAccess from '../../../functionality/spotifyAccess';
import './SearchSources.css';
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
const SearchSources = (props) => {

    const [searchStr, setSearchStr] = useState();
    const [music, setMusic] = useState([]);
    const [state, setState] = useState(NOT_SEARCHING);
    const [searchingFor, setSearchingFor] = useState('PLAYLISTS');


    const search = () => {
        setMusic([]);
        
        if (searchingFor === 'ALBUMS') {
            setState(SEARCHING);
            spotifyApi.searchAlbums(searchStr)
            .then((data) => {
                setMusic(data.body.albums.items);
                setState(NOT_SEARCHING);
            })
            .catch((err) => {
                setState(NOT_SEARCHING);
                alert('Could not search');
            });
        }

        if (searchingFor === 'PLAYLISTS') {
            setState(SEARCHING);
            spotifyApi.searchPlaylists(searchStr)
            .then((data) => {
                setMusic(data.body.playlists.items);
                setState(NOT_SEARCHING);
            })
            .catch((err) => {
                setState(NOT_SEARCHING);
                alert('Could not search');
            });
        }
    }


    return (
        <div>        
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                     defaultChecked={true} onChange={(e) => setSearchingFor('PLAYLISTS')}/>
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Playlists
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                        onChange={(e) => setSearchingFor('ALBUMS')}/>
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Albums
                </label>
            </div>
            <input placeholder='Search album' onChange={(e) => {
                setSearchStr(e.target.value)
                if (e.target.value.length == 0) {
                    setMusic(null);
                }
            }}/>

            <button onClick={() => search()}>Search</button>
            
            {
                music?.map((album, index) => (
                    <div className='album' key={album.uri}>
                        <MusicSource uri={album.uri} key={album.uri} minimal={true}/> 
                        <button onClick={() => props.onChoose(album.uri)}>
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

export default SearchSources;