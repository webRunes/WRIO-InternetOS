import React from 'react';
import { Row, Col, FormGroup, FormControl, Form, ControlLabel } from 'react-bootstrap';

const EditExternalForm = ({ url, onChange, itemKey }) => (
  <Form horizontal>
    <FormGroup controlId="formHorizontalEmail">
      <Col componentClass={ControlLabel} sm={2}>
        Url
      </Col>
      <Col sm={10}>
        <FormControl
          type="email"
          placeholder="Enter list url here"
          value={url}
          onChange={e => onChange(itemKey, e)}
        />
      </Col>
    </FormGroup>
  </Form>
);

const EditExternal = ({
  externals, onChange, onAddElement, removeItem,
}) => (
  <div>
    {externals.map((item, i) => (
      <EditExternalForm key={i} itemKey={i} url={item} onChange={onChange} />
    ))}
    <button className="btn" onClick={onAddElement}>
      Add element
    </button>
  </div>
);

export default EditExternal;
