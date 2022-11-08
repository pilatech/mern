import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { API_ENDPOINT_PATH } from '../../config';
import { Button, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { TextInput } from '../TextInput';
import { DatePicker } from './DatePicker';
import Swal from 'sweetalert2';
const PHONE_REGEXP = /^([0-9\\(\\)\\/\\+ \\-]*)$/;

function FormikContainer() {
  const [isWorking, setIsWorking] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


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

  const image = location.state?.image ?? null;

  const initialValues = {
    firstName: '',
    lastName: '',
    sex: '',
    birthDate: '',
    email: '',
    phoneNumber: '',
    address: '',
    glucoseLevel: '',
    bloodPressure: ''
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required('Name cannot be empty'),
    lastName: Yup.string().required('Last Name cannot be empty'),
    sex: Yup.string().required('You must choose your gender'),
    birthDate: Yup.date().required('Date of birth is required').nullable(),
    email: Yup.string()
      .required('Email is required')
      .email('Enter a valid Email address'),
    phoneNumber: Yup.string()
      .matches(PHONE_REGEXP, 'Phone number is not valid')
      .required('Phone Number cannot be empty'),
    address: Yup.string().required('Address cannot be empty'),
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
      .post(`${API_ENDPOINT_PATH}/api/register`, {
        ...values,
        prescription: image,
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
        navigate('/success');
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
                    <h2 className="lead">Fill in your details</h2>
                  </div>
                  <TextInput
                    errors={errors}
                    handleChange={handleChange}
                    name="firstName"
                    type="text"
                    label="First Name"
                    touched={touched}
                    values={values}
                    readOnly={isWorking}
                  />
                  <TextInput
                    errors={errors}
                    handleChange={handleChange}
                    name="lastName"
                    type="text"
                    label="Last Name"
                    touched={touched}
                    values={values}
                    readOnly={isWorking}
                  />
                  <Form.Group>
                    <Form.Label>Sex</Form.Label>
                    <div>
                      <ToggleButtonGroup type="radio" name="sex">
                        <ToggleButton
                          id="tbg-radio-1"
                          variant="outline-secondary"
                          value="male"
                          checked={values.sex === 'male'}
                          onChange={(val) =>
                            formik.setFieldValue('sex', 'male')
                          }
                          readOnly={isWorking}
                        >
                          Male
                        </ToggleButton>
                        <ToggleButton
                          id="tbg-radio-2"
                          variant="outline-secondary"
                          value="female"
                          checked={values.sex === 'female'}
                          readOnly={isWorking}
                          onChange={(val) =>
                            formik.setFieldValue('sex', 'female')
                          }
                        >
                          Female
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </Form.Group>

                  <DatePicker
                    form={formik}
                    label="Birth Date"
                    name="birthDate"
                    readOnly={isWorking}
                  />

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
                    name="phoneNumber"
                    type="tel"
                    label="Phone Number"
                    touched={touched}
                    values={values}
                    readOnly={isWorking}
                  />

                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
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
                      Submit/Register
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
