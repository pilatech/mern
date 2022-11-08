import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './routes/Home';
import Form from './components/Form/';
import LoginForm from './components/Form/LoginForm'
import Camera from './components/Camera/';
import Success from './routes/Success';
import Profile from './components/Profile/'
import Settings from './components/Profile/Settings'
import ProfileForm from './components/Form/ProfileForm'
import { Col, Row, Container } from 'react-bootstrap';

function App() {
  return (
    <Container className="bg-dark text-light" fluid>
      <Row>
        <Col
          xs="12"
          md={{ span: 10, offset: 1 }}
          lg={{ span: 8, offset: 2 }}
          xl={{ span: 6, offset: 3 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/take-shot" element={<Camera />} />
            <Route path="/register" element={<Form />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/success" element={<Success />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update" element={<ProfileForm />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
