import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faClose } from '@fortawesome/free-solid-svg-icons'
import spotifyControl from "../../functionality/spotifyControl";
import './AddSources.css';

const AddSources = () => {
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [sourceLink, setSourceLink] = useState(null);

    const addSource = (link) => {
        spotifyControl().addSource(link);
    }
    

    if (isExpanded) {
        return (
            <div className="expanded">
                <button onClick={() => setIsExpanded(false)}>
                    <FontAwesomeIcon icon={faClose}/>
                </button>
                Playlist or album link: <input type="text" onChange={(e) => setSourceLink(e.target.value)}/>
                    <button>
                        Add source
                    </button>            
            </div>
        )
    }

    if (!isExpanded) {
        return (
            <button onClick={() => setIsExpanded(true)}>
                <p>Add sources</p>
                <FontAwesomeIcon icon={faCirclePlus} size="3x"/>
            </button>
        )
    }
}

export default AddSources;