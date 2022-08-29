import navigate from "../../functionality/navigate";

const NotFound = () => {

    const goHome= () => {
        const navigator = navigate();
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