import mainButtonImage from '../mainButton.png';
import { useNavigate} from 'react-router-dom';
import { Button, Col, Image, Row } from 'react-bootstrap';

export const Home = () => {
  const navigate = useNavigate();
  const handleStartButton = () => {
    navigate("/take-shot")
  }
  const handleLogginButton = () => {
   console.log('Loggin In')
   navigate("/login")
  }
  return (
    <Row className="bg-dark">
      <Col
        xs={{ span: 10, offset: 1 }}
        lg={{ span: 8, offset: 2 }}
        className="d-flex flex-column min-vh-100 justify-content-around"
      >
        <Row>
          <Col xs="12" className="d-flex justify-content-center">
            <Image
              src={mainButtonImage}
              alt="main-logo"
              className="w-75"
              style={{ maxWidth: '24rem', maxHeight:'24rem', objectFit:'contain' }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <h3 className="text-center font-weight-lighter">
              Welcome to Ezulu Life. Get your health back, hustle free.
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs="12" className="mt-5">
            <Button block variant="primary" size="lg" onClick={handleStartButton}>
              Start Here
            </Button>
          </Col>
          <Col xs="12" className="my-4">
            <Button block size="lg" 
            variant="secondary"
            onClick={handleLogginButton}>
              Login
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            &nbsp;
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

