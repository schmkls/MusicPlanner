import Start from "../pages/start/Start";
import Info from "../pages/info/Info";
import ControlVolume from "../pages/controlVolume/ControlVolume";
import ControlMusic from "../pages/controlMusic/ControlMusic";
import NotFound from "../pages/notFound/NotFound";

/** 
* Can get elements associated with a route.
*/
const urlBeginning = 'http://localhost:3000';

export const pages = {
    home: {
        path: '/', 
        element: <Start/>
    }, 
    musicControl: {
        path: '/music-control',
        element: <ControlMusic/>
    }, 
    volumeControl : {
        path: '/volume-control',
        element: <ControlVolume/>
    }, 
    authRedirect: {
        path: '/auth-callback', 
        element: <div/>,
        redirectTo: '/'
    }, 
    info: {
        path: '/info',
        element: <Info/>
    },
    notFound: {
        element: <NotFound/>
    }
};


/** 
 * @param page amongst the pages
 * @returns url associated to page
 */
export const getURL = (page) => {
    return new URL(urlBeginning + page.path);
}


/**
 * @returns the elements that should be displayed for current location
 */
export const getElements = () => {
    const result = [];
    
    for (var key in pages) {
        if (!pages.hasOwnProperty(key)) {
            continue;
        }
        var page = pages[key];

        // eslint-disable-next-line eqeqeq  
        if (window.location.pathname == page.path || page.path === 'all') {
            result.push(page.element);
        }
    }

    //todo: find better solution
    if (result.includes(pages.authRedirect.element)) {
        window.location.href = pages.authRedirect.redirectTo;
    }

    if (result.length === 0) { 
        console.log('no elements found for: ' + window.location.pathname);
        result.push(pages.notFound.element);
    }

    return result;
}

export const navigate = (page) => {
    window.location.href = getURL(page);
}