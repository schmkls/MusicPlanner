import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import navigate from '../../functionality/navigate';

const GoHomeButton = (props) => {
    const navigator = navigate();

    const goHome = () => {
        if (!props.onGoHome()){
            navigator.navigate(navigator.pages.home);
            return;
        } 

        props.onGoHome()
        .then(() => navigator.navigate(navigator.pages.home))
        .catch((err) => navigator.navigate(navigator.pages.home));
    }

    return (
        <button onClick={() => goHome()}>
            <FontAwesomeIcon icon={faArrowLeft} size='2x' className='icon nav-btn'/>
        </button>
        
    )
}

export default GoHomeButton;