import React from 'react';
import { useState, useEffect } from 'react'
import Camera, { FACING_MODES, IMAGE_TYPES } 
from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImagePreview from './imagePreview'

function CameraContainer () {

  const [ image, setImage ] = useState('')
  const [ imageAvailable, setIsImageAvailable ] = useState(false)

  useEffect(() => {

  }, [image])

  function showCamera(){
    setImage('')
    setIsImageAvailable('')
  }

  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    setImage(dataUri)
    setIsImageAvailable(true)
  }

  function handleCameraError (error) {
    console.log('handleCameraError', error);
  }

  const cameraOrImage = imageAvailable ?
    ( <ImagePreview showCamera={showCamera} src={image}/> ) :
    ( 
      <>
        <h2>Take a shot of your prescription</h2>
        <Camera
        onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
        onCameraError = { (error) => { handleCameraError(error); } }
        idealFacingMode = {FACING_MODES.ENVIRONMENT}
        idealResolution = {{width: 412, height: 732}} //width: 480, height: 640
        imageType = {IMAGE_TYPES.JPG}
        imageCompression = {0.97}
        isMaxResolution = {true}
        isSilentMode = {true}
        isDisplayStartCameraError = {true}
        isFullscreen = {false}
      /> 
      </>
    )


  return (
    <>
      {cameraOrImage}
    </>
  );
}

export default CameraContainer;