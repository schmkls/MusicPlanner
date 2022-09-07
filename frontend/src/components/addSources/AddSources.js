import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faClose } from '@fortawesome/free-solid-svg-icons'
import spotifyControl from "../../functionality/spotifyControl";
import './AddSources.css';
import SearchAlbum from "../searchAlbums/SearchAlbums";

const AddSources = () => {
    
    const [isExpanded, setIsExpanded] = useState(false);

    const addSource = (uri) => {
        spotifyControl().addSource(uri);
        setIsExpanded(false);
    }

    if (isExpanded) {
        return (
            <div className="expanded">
                <button onClick={() => setIsExpanded(false)}>
                    <FontAwesomeIcon icon={faClose}/>
                </button>
                <SearchAlbum chooseFunc={addSource}/>      
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