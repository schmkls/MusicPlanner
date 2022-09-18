import { useEffect, useState } from "react";
import './TimeSliders.css';

const TOUCHED = "touched";
const UNTOUCHED ="unTouched"; 

const times = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]

/**
 * Sliders controlling some values in time.  
 * 
 * @param props.onChange function to handle change of slider values, 
 *        (param: array of arrays like:
 * 
 *              [[hour, preferredVolume, touched], [hour, preferredVolume, touched], ...]
 * 
 *              where: 
 *                  hour = when volume is preferred
 *                  preferredVolume = preferred volume for hour (from 0 to 100)
 *                  touched = true if value has been changed from default
 * 
 *        
 * @param props.getOriginalValue(param: hour)      function for getting original value for slider 
 * @param props.defaultValue                       default value for slider if no original value found
 */
const TimeSliders = (props) => {

    for (let i = 0; i < localStorage.length; i++) {
        console.log("ls: ", localStorage.key(i));
    }

    //set values as touched if original values found, else use default value
    let defaults = [];
    for (let i = 0; i < times.length; i++) {
        let ogVal = props.getOriginalValue(times[i]);
        console.log("ogVal for " + times[i] + " is " + ogVal);

        if (!ogVal) {
            defaults.push([times[i], props.defaultValue, UNTOUCHED]);    
        }
        else {
            defaults.push([times[i], ogVal, TOUCHED]);
        }

    }

    const [vals, setVals] = useState(defaults);

    const handleChange = (index, val) => {
        let temp = Array.from(vals);
        temp[index] = [times[index], val, TOUCHED];
        setVals(temp);
    }


    useEffect(() => {
        props.onChange(vals);
    }, [vals]);

    return (
        <div className="outmost">
            {
                vals.map((val, index) => (
                    <div key={index} className="slidersContainer">
                        <input 
                            value={val[1]} 
                            type="range" 
                            min="0" 
                            max="100" 
                            className={ val[2] === TOUCHED ? 'touched slider' : 'unTouched slider' }
                            onChange={(e) => handleChange(index, e.target.value)}
                            key={index}
                        />
                    </div>
                ))
            }
        </div>
    )



}

export default TimeSliders;