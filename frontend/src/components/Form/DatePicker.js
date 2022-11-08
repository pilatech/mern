import React from 'react';
import DateView from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form } from 'react-bootstrap';

export const DatePicker = ({ name, label, form, ...rest }) => {
  const { errors, touched, values } = form;
  return (
    <Form.Group controlId={`${name}Fmk`}>
      <Form.Label>Birth Date</Form.Label>
      <DateView
        onChange={(val) => form.setFieldValue(name, val)}
        id={name}
        className="form-control"
        placeholderText="Type year first then use date picker"
        selected={values[name]}
        {...rest}
      />
      {touched[name] && (
        <Form.Control.Feedback type="invalid">
          {errors[name]}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
