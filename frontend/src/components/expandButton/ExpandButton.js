import { useState } from "react";

/**
 * A button that expands right/down to show something when clicked. 
 * 
 * @param props.normalElement the element to show when not expanded
 * @param props.expandElement the element to show when expanded
 */
const ExpandButton = (props) => {
    
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <button onClick={() => setIsExpanded(!isExpanded)}>
            {
                isExpanded ?
                    props.expandElement? props.expandElement : <></>
                :
                    props.normalElement? props.normalElement : <></>
            }
        </button>
    )
}

export default ExpandButton;