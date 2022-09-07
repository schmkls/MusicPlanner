import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faClose } from '@fortawesome/free-solid-svg-icons'
import spotifyControl from "../../functionality/spotifyControl";
import './AddSources.css';
import SearchAlbum from "../searchAlbums/SearchAlbums";


/**
 * 
 * @param props.addSource function for adding a source with playlist/album uri as parameter
 * @returns 
 */
const AddSources = (props) => {
    
    const [isExpanded, setIsExpanded] = useState(false);

    
    if (isExpanded) {
        return (
            <div className="expanded">
                <button onClick={() => setIsExpanded(false)}>
                    <FontAwesomeIcon icon={faClose}/>
                </button>
                <SearchAlbum chooseFunc={(uri) => {
                    props.addSource(uri);
                    setIsExpanded(false);
                }}/>      
            </div>
        )
    }

    if (!isExpanded) {
        return (
            <button onClick={() => setIsExpanded(true)}>
                Add sources
                <FontAwesomeIcon icon={faCirclePlus}/>
            </button>
        )
    }
}

export default AddSources;