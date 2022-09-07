import ExpandButton from '../../components/expandButton/ExpandButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import navigate from '../../functionality/navigate';

const Info = () => {

    const navigator = navigate();

    return (
        <div>
            <button onClick={(e) => window.location.assign(navigator.getURL(navigator.pages.home))}>
                <FontAwesomeIcon icon={faArrowLeft}/>    
            </button>
            
            <h2>How to use MusicPlanner</h2>
            <ExpandButton normalElement={<p>Control volume</p>} expandElement={
                <p>
                    1. Press control volume<br/>
                    2. Drag the nodes controlling Spotify-volume per hour<br/>
                    3. Play music!<br/>
                </p>
            }/>
            <hr/>
            <ExpandButton normalElement={<p>Control tempo</p>} expandElement={
                <p>
                    1. Press "Control tempo"<br/>
                    2. Drag the nodes controlling prefferred tempo of music<br/>
                    3. Clear your Spotify queue<br/>
                    4 (optional). Add sources of music.<br/>  
                    5. Play music from a playlist or album! 
                </p>
            }/>
            <hr/>
            <ExpandButton normalElement={<p>Control popularity</p>} expandElement={
                <p>
                    1. Press "Control popularity"<br/>
                    2. Drag the nodes controlling prefferred popularity of music<br/>
                    3. Clear your Spotify queue<br/>
                    4 (optional). Add sources of music.<br/>  
                    5. Play music from a playlist or album! 
                </p>
            }/>
        </div>
    )
}   


export default Info;