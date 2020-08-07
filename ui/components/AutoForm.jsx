import React from 'react';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm as UniformsAutoForm } from 'uniforms-antd';
import prepareFormModel from '../../modules/prepareFormModel';

function AutoForm({ id, name, schema, model, formRef, ...props }) {
  const bridgedSchema = new SimpleSchema2Bridge(schema);

  const preparedFormModel = prepareFormModel(model);

  return (
    <UniformsAutoForm
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
};

AutoForm.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  showInlineError: PropTypes.bool,
  placeholder: PropTypes.bool,
  schema: PropTypes.object.isRequired,
  model: PropTypes.object,
  formRef: PropTypes.object,
};

export default AutoForm;
