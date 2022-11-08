import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Form } from 'react-bootstrap'
import { BsGear, BsArrowLeft} from 'react-icons/bs'
import { } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_ENDPOINT_PATH } from '../../config'
import { Formik } from 'formik';
import * as Yup from 'yup';
import LoadingOverlay from 'react-loading-overlay';
import { TextInput } from '../TextInput';
import Swal from 'sweetalert2';

  

function ProfileSettings() {
 //const [authenticated, setAuthenticated] = useState(false)
 const [profileData, setProfileData] = useState({})
 const navigate = useNavigate()
 const [isWorking, setIsWorking] = useState(false);

 useEffect(() => {
  axios.post(`${API_ENDPOINT_PATH}/api/getProfile`, {}, {
   headers: {
    "x-access-token": localStorage.getItem('token')
   }
  }).then(res => {
    if(!res.data.auth){
     //setAuthenticated(false)
     navigate('/login')
    } else {
     //setAuthenticated(true)
     setProfileData(res.data.user)
    }
  })
 }, [navigate, isWorking])

  
  const initialValues = {
    phoneNumber: '',
    address: '',
    password: ''
  };
  const validationSchema = Yup.object({
    phoneNumber: Yup.string().nullable(),
    address: Yup.string().nullable(),
    password: Yup.string().nullable()
  });
  const onSubmit = (values) => {
    setIsWorking(true);
    axios
      .patch(`${API_ENDPOINT_PATH}/api/${profileData._id}`, {
        ...values,
      }, {
       headers: {
        "x-access-token": localStorage.getItem('token')
       }
      })
      .then((response) => {
        setIsWorking(false);
        if (response.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.error || 'An error occured',
          });
          return;
        }
        navigate('/profile')
      })
      .catch((e) => {
        setIsWorking(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: e.message || 'An error occured',
        });
      });
  };



const handleLogout = () => {
 //setAuthenticated(false)
 localStorage.setItem('token', 'expired')
 navigate('/login')
}

const handleGoBack = () => {
 navigate('/profile')
}


 return (
  <div>
    <Row className="py-3 bg-secondary" >
     <Col xs="8">
     <Button
     onClick={handleGoBack}
     variant="secondary"
     size="lg"
     className="d-flex align-items-center"
     >
     <BsArrowLeft/>
      </Button>

     </Col>
     <Col xs="4" className="d-flex align-items-center justify-content-end">
      <Button
      className="logout-button"
      variant="secondary"
      size="md"
      onClick={handleLogout}
      >Logout</Button>
      <Button
      className="p-1 settings-button"
      onClick={handleGoBack}
      variant="secondary"
      size="lg"
      ><BsGear/></Button>
     </Col>
   </Row>
   <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        isInitialValid={false}
        validateOnBlur={true}
        validateOnChange={true}
      >
        {(formik) => {
          const {
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
          } = formik;
          return (
            <div className="home">
           
                <Form noValidate onSubmit={handleSubmit} onBlur={handleBlur} autoComplete='off'>
                  <div className="py-4">
                    <h2 className="lead">Edit your Details (Fill what you want to change only)</h2>
                  </div>
                  <TextInput
                    errors={errors}
                    handleChange={handleChange}
                    name="phoneNumber"
                    type="tel"
                    placeholder={profileData.phoneNumber}
                    label="Edit Phone Number"
                    touched={touched}
                    values={values}
                    readOnly={isWorking}
                  />

                  <Form.Group controlId="address">
                    <Form.Label>Edit Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder={profileData.address}
                      rows={3}
                      name="address"
                      style={{ resize: 'none' }}
                      value={values.address}
                      onChange={handleChange}
                      isValid={touched.address && !errors.address}
                      readOnly={isWorking}
                    />
                    <Form.Control.Feedback type="valid">
                      Looks good!
                    </Form.Control.Feedback>
                  </Form.Group>

                  <TextInput
                    errors={errors}
                    handleChange={handleChange}
                    name="password"
                    type="text"
                    label="Change your password"
                    placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                    touched={touched}
                    values={values}
                    readOnly={isWorking}
                  />

                  <div className="pb-5 pt-2">
                  <LoadingOverlay active={isWorking} spinner>
                    <Button
                      type="submit"
                      title={
                        !formik.isValid
                          ? 'Complete the necessary fields first to proceed'
                          : 'Proceed'
                      }
                      size="lg"
                      className="my-3"
                      block
                      disabled={isWorking}
                    >
                      Save Settings
                    </Button>
                    </LoadingOverlay>
                  </div>
                </Form>
              
            </div>
          );
        }}
      </Formik>
  </div>
 )
}

export default ProfileSettings
