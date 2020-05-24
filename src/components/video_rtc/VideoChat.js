import React, {useState, useEffect, useCallback} from 'react';

import RTCMultiConnection from 'rtcmulticonnection-react-js';

import {getHTMLMediaElement} from './helper';

import RecordRTC from 'recordrtc';
// import { queryHelpers } from '@testing-library/dom';


const VideoChat = () => {

    const connection = new RTCMultiConnection();
    connection.socketURL = 'http://localhost:3002/';

    const [state, setState] = useState({urls:''});

    useEffect(() =>{ 
        fetchConection();
    });

    const fetchConection = useCallback(() => { 
        connection.socketMessageEvent = 'video-conference-demo';
    
        connection.session = {
            audio: true,
            video: true
        };
        
        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };
    
    // STAR_FIX_VIDEO_AUTO_PAUSE_ISSUES
    // via: https://github.com/muaz-khan/RTCMultiConnection/issues/778#issuecomment-524853468
        var bitrates = 512;
        var resolutions = 'Ultra-HD';
        var videoConstraints = {};
        
        if (resolutions == 'HD') {
            videoConstraints = {
                width: {
                    ideal: 1280
                },
                height: {
                    ideal: 720
                },
                frameRate: 30
            };
        }
        
        if (resolutions == 'Ultra-HD') {
            videoConstraints = {
                width: {
                    ideal: 1920
                },
                height: {
                    ideal: 1080
                },
                frameRate: 30
            };
        }
        
        connection.mediaConstraints = {
            video: videoConstraints,
            audio: true
        };    
        
        var CodecsHandler = connection.CodecsHandler;

        connection.processSdp = function(sdp) {
            var codecs = 'vp8';
            
            if (codecs.length) {
                sdp = CodecsHandler.preferCodec(sdp, codecs.toLowerCase());
            }
        
            if (resolutions == 'HD') {
                sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
                    audio: 128,
                    video: bitrates,
                    screen: bitrates
                });
        
                sdp = CodecsHandler.setVideoBitrates(sdp, {
                    min: bitrates * 8 * 1024,
                    max: bitrates * 8 * 1024,
                });
            }
        
            if (resolutions == 'Ultra-HD') {
                sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
                    audio: 128,
                    video: bitrates,
                    screen: bitrates
                });
        
                sdp = CodecsHandler.setVideoBitrates(sdp, {
                    min: bitrates * 8 * 1024,
                    max: bitrates * 8 * 1024,
                });
            }    
            return sdp;
        };
        // END_FIX_VIDEO_AUTO_PAUSE_ISSUES
        
        // https://www.rtcmulticonnection.org/docs/iceServers/
        // use your own TURN-server here!
        connection.iceServers = [{
            'urls': [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun.l.google.com:19302?transport=udp',
            ]
        }];
        
        connection.videosContainer = document.getElementById('videos-container');

        connection.onstream = function(event) {       
            var existing = document.getElementById(event.streamid);
            if(existing && existing.parentNode) {
                existing.parentNode.removeChild(existing);
            }
        
            event.mediaElement.removeAttribute('src');
            event.mediaElement.removeAttribute('srcObject');
            event.mediaElement.muted = true;
            event.mediaElement.volume = 0;
        
            var video = document.createElement('video');
        
            try {
                video.setAttributeNode(document.createAttribute('autoplay'));
                video.setAttributeNode(document.createAttribute('playsinline'));
            } catch (e) {
                video.setAttribute('autoplay', true);
                video.setAttribute('playsinline', true);
            }
        
            if(event.type === 'local') {
            video.volume = 0;
            try {
                video.setAttributeNode(document.createAttribute('muted'));
            } catch (e) {
                video.setAttribute('muted', true);
            }
            }
            video.srcObject = event.stream;   
        
            
            var width = parseInt(connection.videosContainer.clientWidth / 3) - 20;
        
            var mediaElement = getHTMLMediaElement(video, {
                title: "ankur",
                buttons: ['full-screen'],
                width: width,
                showOnMouseEnter: false
            });
        
            console.log('mediaElement ',mediaElement);
            connection.videosContainer.appendChild(mediaElement);
        
            setTimeout(function() {
                mediaElement.media.play();
            }, 5000);
        
            mediaElement.id = event.streamid;
        
            // to keep room-id in cache
            localStorage.setItem(connection.socketMessageEvent, connection.sessionid);   
            
            var chkRecordConference = document.getElementById('record-entire-conference');    
        
        //  chkRecordConference.parentNode.style.display = 'none';
        
            if(chkRecordConference.checked === true) {
            //  btnStopRecording.style.display = 'inline-block';
        //   recordingStatus.style.display = 'inline-block';
        
            var recorder = connection.recorder;
            if(!recorder) {
                recorder = RecordRTC([event.stream], {
                type: 'video'
                });
                recorder.startRecording();
                connection.recorder = recorder;
            }
            else {
                recorder.getInternalRecorder().addStreams([event.stream]);
            }
        
            if(!connection.recorder.streams) {
                connection.recorder.streams = [];
            }
        
            connection.recorder.streams.push(event.stream);
        //     recordingStatus.innerHTML = 'Recording ' + this.connection.recorder.streams.length + ' streams';
            }
        
            if(event.type === 'local') {
            connection.socket.on('disconnect', function() {
                if(!connection.getAllParticipants().length) {
            //    location.reload();
                }
            });
            }
        };
    })


    const openRoom = () => {     
        connection.open("abcdef", function(isRoomOpened, roomid, error) {
          if(isRoomOpened === true) {
            showRoomURL();
          }
          else {
         //   disableInputButtons(true);
            if(error === 'Room not available') {
              alert('Someone already created this room. Please either join or create a separate room.');
              return;
            }
            alert(error);
          }
      });    
    }

    const  showRoomURL = () => {
        console.log('test showRoolURL');    
        var roomHashURL = '#' + "abcdef";
        var roomQueryStringURL = '?roomid=' + "abcdef";
        var html = '<h2>Unique URL for your room:</h2><br>';
    
        html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
        html += '<br>';
        html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
        var roomURLsDiv = document.getElementById('room-urls');
        roomURLsDiv.innerHTML = html;
       
        roomURLsDiv.style.display = 'block';
        setState({...state,urls:html});
    }

    const joinRoom = () => {
        // this.newButton();
         connection.join(document.getElementById('room-id').value, function(isJoinedRoom, roomid, error) {
           if (error) {
               //  disableInputButtons(true);
                 if(error === 'Room not available') {
                   alert('This room does not exist. Please either create it or wait for moderator to enter in the room.');
                   return;
                }
                 alert(error);
            }
        });
    }


   return (
        <>
            <div id="room-urls" value={state.urls}></div>
            <input type="text" id="room-id" value="abcdef" autocorrect="off" autocapitalize="off"/>
            <button onClick={openRoom}>Open Room</button>
            <button onClick={joinRoom}>Join Room</button>
            <div id="videos-container"></div>
        </>
   )
}

export default VideoChat;