import React from "react";
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route } from 'react-router-dom';
import VideoRTCRoute from './videoRTCRoute';
    
ReactDOM.render(
    <BrowserRouter>   
        <Route component={VideoRTCRoute} />    
    </BrowserRouter>,
    document.getElementById('root')
);

registerServiceWorker();





