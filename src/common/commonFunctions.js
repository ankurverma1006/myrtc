import React from 'react';
//import crypto from 'crypto';
//import CONSTANTS from './core/config/appConfig';



// used to set localstorage item
export const setLocalStorage = (key, value) => {
  value = JSON.stringify(value);
  const encodedData = encryptedData(value);
  localStorage.setItem(key, encodedData);
};

// used to get localstorage item
export const getLocalStorage = key => {
  if (key) {
    let data = localStorage.getItem(key);
    if (data) {
      data = JSON.parse(decryptedData(data));
      return data;
    }
  }
  return null;
};

// used to remove localstorage item
export const removeLocalStorage = key => {
  localStorage.removeItem(key);
};

// used to clear localstorage
export const clearLocalStorage = () => {
  localStorage.clear();
};



// used to get apiurl for different servers
export function getAPIURL() {
  let returnUrl = {
    APIURL: '',
    azureContainer: '',
    azureThumbContainer: '',
    httpServer: '',
    APIPort: ''
  };
  switch (window.location.hostname) {
    case '104.42.51.157':
      returnUrl.APIURL = '104.42.51.157';
      returnUrl.azureContainer = 'spikeview-media-production';
      returnUrl.azureThumbContainer = 'spikeview-media-production-thumbnails';
      returnUrl.httpServer = 'https://';
      returnUrl.APIPort = '3002';
      break;

    case 'spikeview.com':
      returnUrl.APIURL = 'spikeview.com';
      returnUrl.azureContainer = 'spikeview-media-production';
      returnUrl.azureThumbContainer = 'spikeview-media-production-thumbnails';
      returnUrl.httpServer = 'https://';
      returnUrl.APIPort = '3002';
      break;

    case 'app.spikeview.com':
      returnUrl.APIURL = 'app.spikeview.com';
      returnUrl.azureContainer = 'spikeview-media-production';
      returnUrl.azureThumbContainer = 'spikeview-media-production-thumbnails';
      returnUrl.httpServer = 'https://';
   //   returnUrl.APIPort = '3002';
      break;

    case '103.76.253.131':
      returnUrl.APIURL = '103.76.253.131';
      returnUrl.azureContainer = 'spikeview-media-development';
      returnUrl.azureThumbContainer = 'spikeview-media-development-thumbnails';
      returnUrl.httpServer = 'http://';
      returnUrl.APIPort = '3002';
      break;

    default:
      returnUrl.APIURL = 'localhost'; //:'172.16.0.131';
      returnUrl.azureContainer = 'spikeview-media-development';
      returnUrl.azureThumbContainer = 'spikeview-media-development-thumbnails';
      returnUrl.httpServer = 'http://';
      returnUrl.APIPort = '3002';
      break;
  }
  return returnUrl;
}

