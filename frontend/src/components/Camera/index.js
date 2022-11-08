import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Row, Image } from 'react-bootstrap';
import axios from 'axios'
import { Link} from 'react-router-dom';
import Connecting from '../Connecting';
import Webcam from 'react-webcam';
import { API_ENDPOINT_PATH } from '../../config';

const VIDEO_CONSTRAINTS = {
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 },
    facingMode: 'environment',
  },
};

function Camera() {
  const [authenticated, setAuthenticated] = useState(false)
  const [image, setImage] = useState(null);
  const [isLoadedCamera, setIsLoadedCamera] = useState(false);

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

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc)
  }, [webcamRef]);

  const retake = () => setImage(null);

  return (
    <Row className="vh-100 position-relative">
      <div className="bg-dark h-100 w-100 overflow-hidden">
        {!isLoadedCamera && <Connecting />}
        {image && (
          <Image
            src={image}
            fluid
            alt="prescription"
            className="h-100 w-100"
            style={{ objectFit: 'contain', objectPosition: 'center' }}
          />
        )}
        <div className="">
        <Webcam
          audio={false}
          ref={webcamRef}
          width={window.innerWidth}
          height={window.innerHeight}
          screenshotFormat="image/jpeg"
          videoConstraints={VIDEO_CONSTRAINTS.video}
          onUserMedia={()=>setIsLoadedCamera(true)}

        />
        </div>
      </div>
      <div className="bg-dark p-4 d-flex flex-column align-items-center justify-content-center position-fixed w-100 fixed-bottom actions-strip">
        <div className={image ? 'show-actions' : 'hide-actions'}>
          <Button
            block
            variant="primary"
            size="lg"
            as={Link}
            to={authenticated ? `/update` : `/register`}
            state={{ image }}
            className="my-3"
          >
            Proceed
          </Button>
          <Button
            className="my-3"
            block
            type="button"
            variant="outline-primary"
            size="lg"
            onClick={retake}
          >
            Retake
          </Button>
        </div>
        <div className={image ? 'hide-actions' : 'show-actions'}>
          <div className="d-flex flex-column align-items-center">
            <div>
              <Button
                type="button"
                className="rounded-circle w-24 snap-btn thick-border border-dark"
                // ref={takeShotButtonRef}
                onClick={capture}
                variant={isLoadedCamera ? 'primary' : 'secondary'}
                disabled={!isLoadedCamera}
              >
                &nbsp;
              </Button>
            </div>
            <div className="pb-2 pt-2">
              <p className={isLoadedCamera ? 'text-white' : 'text-muted'}>
                Take picture of your prescription
              </p>
            </div>
          </div>
        </div>
      </div>
    </Row>
  );
}

export default Camera;
