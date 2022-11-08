import React from 'react'
import { Form } from 'react-bootstrap'

export const TextInput = ({name, type, label, handleChange, errors, touched, values, ...rest}) => {
    return (
        <Form.Group controlId={`${name}Fmk`}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          name={name}
          value={values[name]}
          onChange={handleChange}
          isValid={touched[name] && !errors[name]}
          {...rest}
        />
        {touched[name] && <Form.Control.Feedback type="invalid">
          {errors[name]}
        </Form.Control.Feedback>}
      </Form.Group>
    )
}
