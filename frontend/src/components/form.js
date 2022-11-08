import { useState, 
  // useContext 
} from 'react'
import {
  Formik,
  Form,
  Field,
  ErrorMessage
} from 'formik'
import * as Yup from 'yup'
import TextError from './TextError'
// import Context from '../context/ClientData'

const initialValues = {
  name: '',
  surname: '',
  email: '',
  sex: '',
  dob: '',
  deliveryAddress: ''
}


const onSubmit = async (values, submitProps) => {
  
  // const payload = JSON.stringify({...values})
  // const res = await fetch()
  console.log(submitProps)
  submitProps.setSubmitting(false)
  
 // submitProps.setErrors()
  submitProps.resetForm()
}

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  surname: Yup.string().required('Required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Required'),
  sex: Yup.string().required('Required'),
  dob: Yup.string().required('Required'),
  deliveryAddress: Yup.string().required('Required')
})

const validateTextArea = value => {
  let error
  if (!value) {
    error = 'Required'
  }
  return error
}

function RegistrationForm (props) {
  const [formValues, 
    // setFormValues
  ] = useState(null)

  return (
    <>
    <h2>Enter your details</h2>
    <Formik
      initialValues={formValues || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
      // validateOnChange={false}
      // validateOnBlur={false}
      // validateOnMount
    >
      {formik => {
        return (
          <Form>
            <div className='form-control'>
              <label htmlFor='name'>Name</label>
              <Field type='text' id='name' name='name' />
              <ErrorMessage name='name' component={TextError} />
            </div>

            <div className='form-control'>
              <label htmlFor='surname'>Surname</label>
              <Field type='text' id='surname' name='surname' />
              <ErrorMessage name='surname' component={TextError} />
            </div>

            <div className='form-control'>
              <label htmlFor='email'>Email</label>
              <Field type='email' id='email' name='email' />
              <ErrorMessage name='email'>
                {error => <div className='error'>{error}</div>}
              </ErrorMessage>
            </div>

          {/* this is temporary, RADIO INPUTS will be used for this */}
            <div className='form-control'>
              <label htmlFor='sex'>Sex</label>
              <Field
                type='text'
                id='sex'
                name='sex'
                placeholder='Enter Your Gender (Male/Female)'
              />
             <ErrorMessage name='sex' component={TextError} />
            </div>

            {/* this is temporary, DATEPICKER will be used for this */}
            <div className='form-control'>
              <label htmlFor='dob'>Date of Birth</label>
              <Field
                type='text'
                id='dob'
                name='dob'
                placeholder='Enter your DOB (DD/MM/YYYY)'
              />
              <ErrorMessage name='dob' component={TextError} />
            </div>

            <div className='form-control'>
              <label htmlFor='deliveryAddress'>Delivery Address</label>
              <Field
                as='textarea'
                id='deliveryAddress'
                name='deliveryAddress'
                validate={validateTextArea}
                placeholder='443 Sesame Street, Red Land, Metropolis'
              />
              <ErrorMessage name='deliveryAddress' component={TextError} />
            </div>
            <button
              type='submit'
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Submit
            </button>
          </Form>
        )
      }}
    </Formik>
    </>
  )
}

export default RegistrationForm