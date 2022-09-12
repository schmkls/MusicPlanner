import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faClose } from '@fortawesome/free-solid-svg-icons'
import './AddSources.css';
import SearchSources from "../searchSources/SearchSources";

/**
 * 
 * @param addSource function for adding a source with playlist/album uri as parameter
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
                <SearchSources onChoose={(uri) => {
                    props.onAdd(uri);
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