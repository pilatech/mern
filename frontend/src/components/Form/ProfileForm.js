import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { API_ENDPOINT_PATH } from '../../config';
import { Button, Form } from 'react-bootstrap';
import { TextInput } from '../TextInput';
import Swal from 'sweetalert2';

function FormikContainer() {
  const [isWorking, setIsWorking] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState({})
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
     navigate('/login')
    } else {
     setAuthenticated(true)
     setProfileData(res.data.user)
    }
  })
 }, [authenticated, navigate])

  const image = location.state?.image ?? null;

  const initialValues = {
    glucoseLevel: '',
    bloodPressure: ''
  };
  const validationSchema = Yup.object({
    glucoseLevel: Yup.string().nullable(),
    bloodPressure: Yup.string().nullable()

  });
  const onSubmit = (values) => {
    if (!image) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error processing prescription image. Please take again',
        didClose: () => navigate('/take-shot'),
      });
      return;
    }
    setIsWorking(true);
    axios
      .post(`${API_ENDPOINT_PATH}/api/add`, {
        ...values,
        prescription: image,
        id: profileData._id
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
        navigate('/profile');
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

  return (
    <>
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
                    <h2>Fill in your details</h2>
                  </div>

                  <TextInput
                    errors={errors}
                    handleChange={handleChange}
                    name="bloodPressure"
                    type="text"
                    label="Blood Pressure (Optional)"
                    touched={touched}
                    values={values}
                    readOnly={isWorking}
                  />

                  <TextInput
                    errors={errors}
                    handleChange={handleChange}
                    name="glucoseLevel"
                    type="text"
                    label="Glucose Level (Optional)"
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
                      Submit
                    </Button>
                    </LoadingOverlay>
                    <Button
                      block
                      variant="outline-primary"
                      size="lg"
                      as={Link}
                      to="/take-shot"
                      state={{ image }}
                      className="my-3"
                    >
                      Go Back
                    </Button>
                  </div>
                </Form>
              
            </div>
          );
        }}
      </Formik>
    </>
  );
}

export default FormikContainer;
