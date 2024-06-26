import React from 'react';
import "./css/Loader.css";

const Loader = (props) => {
    return (
        <div className={`loader-container ${props.toLoad?"":"hide"}`}>
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
