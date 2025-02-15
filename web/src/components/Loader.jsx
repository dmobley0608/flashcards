import React from 'react';
import './Loader.css';

const Loader = ({ progress }) => {
    return (
        <div className="loader-container">
            <div className="lightning-loader">
                <div className="lightning"></div>
                <div className="lightning"></div>
                <div className="lightning"></div>
            </div>
            <div className="progress-text">
                Loading... {Math.round(progress || 0)}%
            </div>
        </div>
    );
};

export default Loader;