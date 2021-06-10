import React from 'react';
import { AutoForm as UniformsAutoForm } from 'uniforms-antd';
import { Bridge, AutoFormProps as UniformsAutoFormProps } from 'uniforms'
import kebabCase from 'lodash/kebabCase';
import SimpleSchema2Bridge from '/imports/ui/libs/uniforms-bridge-simple-schema-2/index';
import prepareFormModel from '/imports/ui/libs/prepareFormModel';

interface AutoFormProps<Model> extends Partial<UniformsAutoFormProps<Model>> {
  name: string;
  id?: string;
  showInlineError?: boolean;
  placeholder?: boolean;
  schema: Bridge;
//  model: Model;
  formComponent?: typeof React.Component;
  formRef?: any;
  children: React.ReactNode;
}

function AutoForm<Model>({ 
  id, 
  name = 'uniforms', 
  showInlineError = true,
  placeholder = true,
  schema, 
  model, 
  formComponent = UniformsAutoForm, 
  formRef,
  ...props 
}:AutoFormProps<Model>) {

  const bridgedSchema = new SimpleSchema2Bridge(schema);
  const preparedFormModel = prepareFormModel(model);
  const FormComponent = formComponent;

  return (
    <FormComponent
      id={id || `form-${kebabCase(name)}`}
      schema={bridgedSchema}
      model={preparedFormModel}
      ref={formRef}
      showInlineError={showInlineError}
      placeholder={placeholder}
      {...props}
    />
  );
}

// AutoForm.defaultProps = {
//   name: 'uniforms',
//   id: undefined,
//   showInlineError: true,
//   placeholder: true,
//   formRef: undefined,
//   model: {},
//   formComponent: UniformsAutoForm,
// };

// AutoForm.propTypes = {
//   name: PropTypes.string,
//   id: PropTypes.string,
//   showInlineError: PropTypes.bool,
//   placeholder: PropTypes.bool,
//   schema: PropTypes.object.isRequired,
//   model: PropTypes.object,
//   formRef: PropTypes.object,
//   formComponent: PropTypes.func,
// };

export default AutoForm;
