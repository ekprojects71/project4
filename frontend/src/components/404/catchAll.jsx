import React from "react";
import { Redirect } from "react-router-dom";

const CatchAll = () => {

    return (
        <Redirect to="/404" />
    )  
}

export default CatchAll;