import React from 'react';
import PropTypes from 'prop-types';
import { AutoForm as UniformsAutoForm } from 'uniforms-antd';
import SimpleSchema2Bridge from '../../libs/uniforms-bridge-simple-schema-2/index';
import prepareFormModel from '../../libs/prepareFormModel';

function AutoForm({ id, name, schema, model, formComponent, formRef, ...props }) {
  const bridgedSchema = new SimpleSchema2Bridge(schema);

  const preparedFormModel = prepareFormModel(model);

  const FormComponent = formComponent;

  return (
    <FormComponent
      id={id || `form-${name}`}
      schema={bridgedSchema}
      model={preparedFormModel}
      ref={formRef}
      {...props}
    />
  );
}

AutoForm.defaultProps = {
  name: 'uniforms',
  id: undefined,
  showInlineError: true,
  placeholder: true,
  formRef: undefined,
  model: {},
  formComponent: UniformsAutoForm,
};

AutoForm.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  showInlineError: PropTypes.bool,
  placeholder: PropTypes.bool,
  schema: PropTypes.object.isRequired,
  model: PropTypes.object,
  formRef: PropTypes.object,
  formComponent: PropTypes.func,
};

export default AutoForm;
