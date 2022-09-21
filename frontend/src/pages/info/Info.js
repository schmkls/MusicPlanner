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
                    3. Keep MusicPlanner open in a tab in your web browser.<br/>
                    3. Play music!<br/>
                </p>
            }/>
            <hr/>
            <ExpandButton normalElement={<p>Control music</p>} expandElement={
                <p>
                    1. wihu<br/>
                    2. wihu2<br/>
                </p>
            }/>
            <ExpandButton normalElement={<p>Give feedback/Report an error</p>} expandElement={
                <div>
                    
                    <button onClick={() => {}}>Send</button>
                </div>
                
            }/>
        </div>
    )
}   


export default Info;