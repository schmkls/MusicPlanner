import Start from "../pages/start/Start";
import Info from "../pages/info/Info";
import VolumeControl from "./volumeControl";
import NotFound from "../pages/notFound/NotFound";

/** 
* Can get elements associated with a route.
*/
const navigate = () => {

    const urlBeginning = 'http://localhost:3000';

    const pages = {
        home: {
            path: '/', 
            element: <Start/>
        }, 
        tempoControl: {
            path: '/volume-control',
            element: <h2>tempo control wihu</h2>
        }, 
        volumeControl: {
            path: '/volume-control',
            element: <VolumeControl/>
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
     const getURL = (page) => {

        return new URL(urlBeginning + page.path);
    }


    /**
     * @returns the elements that should be displayed for current location
     */
     const getElements = () => {
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


    return {
        pages, 
        getURL,
        getElements
    }
}

export default navigate;