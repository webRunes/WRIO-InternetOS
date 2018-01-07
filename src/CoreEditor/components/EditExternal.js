import React from 'react';
import { Row, Col, FormGroup, FormControl, Form, ControlLabel } from 'react-bootstrap';

const EditExternalForm = ({ url, onChange, itemKey }) => (
  <Form horizontal>
    <FormGroup controlId="formHorizontalEmail">
      <Col componentClass={ControlLabel} sm={4} md={3}>
        URL
      </Col>
      <Col sm={8} md={9}>
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
    <div class="well"><p>There is nothing, yet...</p></div>

    <div className="form-group col-xs-12">
      <div className="navbar-right form-buttons">
        <button className="btn btn-default" onClick={onAddElement}>
          <span className="glyphicon glyphicon-plus-sign with_text"></span>Add element
        </button>
      </div>
    </div>
  </div>
);

export default EditExternal;
