import Start from "../pages/Start";


/** 
* Can get elements associated with a route.
*/
const navigate = () => {

    const urlBeginning = 'http://localhost:3000';

    const pages = {
        start: {
            path: '/', 
            element: <Start/>
        }, 
        tempoControl: {
            path: '/tempo-control',
            element: <h2>tempo control wihu</h2>
        }
    }


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

        if (result.length === 1) { //Nav is always found
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