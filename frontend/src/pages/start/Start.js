import Playing from "../../components/playing/Playing";
import SmoothSkip from "../../components/smoothSkip/SmoothSkip";
import React, { useEffect, useState, useReducer } from "react";

const Start = () => {

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    console.log("returning Start");

    return (
        <>
            <Playing/>
            <SmoothSkip onSkip={() => forceUpdate()}/>
        </>
    )

}

export default Start;