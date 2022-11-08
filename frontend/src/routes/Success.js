import React, { useEffect, useState } from 'react';
import { API_ENDPOINT_PATH } from '../config';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../assets/animations/648-victory-success-outline-edited.json';
import axios from 'axios'

export const Success = () => {

 const [authenticated, setAuthenticated] = useState(false)

 useEffect(() => {
  axios.post(`${API_ENDPOINT_PATH}/api/getProfile`, {}, {
   headers: {
    "x-access-token": localStorage.getItem('token')
   }
  }).then(res => {
   console.log(res)
    if(!res.data.auth){
     setAuthenticated(false)
    } else {
     setAuthenticated(true)
    }
  })
 }, [])


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="py-5 text-center">
      <h2 className="text-center">Success!</h2>

      <Lottie options={defaultOptions} height={128} width={128} />

      <p className="py-5"> {authenticated ? 'You details were sent successfully' : 'Details Submited Successfully. Check your email for login password. Also check your Spam'}</p>
      <Button
        block
        variant="success"
        size="lg"
        as={Link}
        to={authenticated ? '/profile' : '/login'}
        className="my-3"
      >
        Back to { authenticated ? 'Profile' : 'login'}
      </Button>
    </div>
  );
};

export default Success;
