import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { API_ENDPOINT_PATH } from '../../config';
import { Button, Form } from 'react-bootstrap';
import { TextInput } from '../TextInput';
import Swal from 'sweetalert2';

function FormikContainer() {
  const [isWorking, setIsWorking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
   axios.post(`${API_ENDPOINT_PATH}/api/getProfile`, {}, {
    headers: {
     "x-access-token": localStorage.getItem('token')
    }
   }).then(res => {
    console.log(res)
     if(res.data.auth){
      navigate('/profile')
     }
   })
  }, [navigate])

  const initialValues = {
    email: '',
    password: ''
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .email('Enter a valid Email address'),
      password: Yup.string().required('Password cannot be empty')
  });
  const onSubmit = (values) => {
   setIsWorking(true);
   axios
     .post(`${API_ENDPOINT_PATH}/api/login`, {
       ...values
     })
     .then((response) => {
       console.log(response)
       if (response.data.error) {
         Swal.fire({
           icon: 'error',
           title: 'Error',
           text: response.data.error || 'An error occured',
         });
         setIsWorking(false)
         return;
       }
       localStorage.setItem('token', response.data.token)
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
                    <h2 className="lead">Login to your Account</h2>
                  </div>
                  <TextInput
                    errors={errors}
                    handleChange={handleChange}
                    name="email"
                    type="email"
                    label="Email"
                    touched={touched}
                    values={values}
                    readOnly={isWorking}
                  />
                  <TextInput
                    errors={errors}
                    handleChange={handleChange}
                    name="password"
                    type="password"
                    label="Password"
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
                      Login
                    </Button>
                    </LoadingOverlay>
                    <Button
                      block
                      variant="outline-primary"
                      size="lg"
                      as={Link}
                      to="/take-shot"
                      className="my-3"
                    >
                      I don't have account
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
