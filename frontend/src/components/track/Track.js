import axios from 'axios';

/**
 * 
 * @param props track data 
 * @returns component displaying track that can choose track on click 
 */
const Track = (props) => {
    const track = props.track;
    const id = track.id;
    const name = track.name;
    const image = track.album.images[0].url;
    const artists = track.artists;


    const makeArtistsString = () => {
        let str = '';

        artists.map((artist, index) => {
            if (index < artists.length && index > 0 && artists.length > 1) {
                str += ', '
            }

            str += artist.name;
        })

        return str;
    }


    const open = () => {
        const getUrl = `https://api.spotify.com/v1/tracks/${id}`;

        axios.get(getUrl)
        .then((res) => {
            window.location.assign(res.data.body.album.external_urls.spotify);
            return false;
        })
        .catch((err) => console.log(err));
    }
    

    return (
        <div>
            <hr/>
            <p onClick={() => open()}>
                {name} - {makeArtistsString()}
            </p>
            <img src={image} width='50' height='50'/>
        </div>
    )
}

export default Track;