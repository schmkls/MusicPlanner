import * as navigator from "../../functionality/navigate";

const NotFound = () => {

    const goHome= () => {
        window.location.href = navigator.getURL(navigator.pages.home);
    }

    return (
        <div>
            <h2>Page not found</h2>
            <button onClick={goHome}>Go Home</button>
        </div>
    )
}

export default NotFound;