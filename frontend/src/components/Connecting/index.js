import React from 'react';

import Lottie from 'react-lottie';
import animationData from '../../assets/animations/1249-heart-beat-outline-edited.json';

export default function Connecting() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="d-flex h-100 w-100  flex-column justify-content-center align-items-center">
    <div className="text-center text-info">
    <span className='text-light'>Connecting to Camera...</span><br/>
    <small className='text-muted'>(Please make sure you have allowed camera permissions)</small>
    </div>
      <div>
      <Lottie options={defaultOptions} height={128} width={128} />
      </div>
    </div>
  );
}
