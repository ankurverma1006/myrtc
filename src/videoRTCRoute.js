import React from 'react';
import { Route, Switch } from 'react-router-dom';

import VideoChat from './components/video_rtc/VideoChat';

const VideoRTCRoute = () => {
    return (
      <Switch>        
        <Route exact path="/" component={VideoChat } />        
      </Switch>
    ); 
}

export default VideoRTCRoute;
