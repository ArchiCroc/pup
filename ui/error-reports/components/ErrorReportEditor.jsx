/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import AutoForm from 'uniforms/AutoForm';
import HiddenField from 'uniforms-antd/HiddenField';
import ListField from 'uniforms-antd/ListField';
import ListItemField from 'uniforms-antd/ListItemField';
import TextField from 'uniforms-antd/TextField';
import prepareFormModel from '../../../modules/prepareFormModel';
import CrossReferenceSearchField from '../../components/CrossReferenceSearchField';
import SelectField from '../../components/SelectField';
/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

import { errorReports as errorReportsQuery } from '../queries/ErrorReports.gql';
import { saveErrorReport as saveErrorReportMutation } from '../mutations/ErrorReports.gql';

import ErrorReportSchema from '../../../api/ErrorReports/schemas/error-report';

import StyledErrorReportEditor from './StyledErrorReportEditor';

function ErrorReportEditor({ doc }) {
  const history = useHistory();
  const [saveErrorReport] = useMutation(saveErrorReportMutation, {
    ignoreResults: true,
    onCompleted: () => {
      message.success(i18n.__('ErrorReports.error_report_saved'));
      history.push('/error-reports');
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: errorReportsQuery }],
  });

  function handleSubmit(form) {
    const cleanForm = ErrorReportSchema.clean(form);
    // console.log('cleanForm', cleanForm);
    saveErrorReport({
      variables: { errorReport: cleanForm },
    });
  }

  // fix issue with uniforms getting a null for visionNames
  if (doc && !doc.visionNames) {
    doc.visionNames = []; //eslint-disable-line
  }

  return (
    <StyledErrorReportEditor>
      <AutoForm
        name="errorReport"
        schema={ErrorReportSchema}
        onSubmit={handleSubmit}
        model={prepareFormModel(doc)}
        showInlineError
        placeholder
      >
        <HiddenField name="_id" />
        <CrossReferenceSearchField name="userId" />
        <SelectField name="level" />
        <TextField name="message" />
        <TextField name="path" />
        <TextField name="userAgent" />
        <ListField name="stack">
          <ListItemField name="$" />
        </ListField>
        <ListField name="reactStack">
          <ListItemField name="$" />
        </ListField>
        <Button htmlType="submit" type="primary" block>
          {i18n.__('ErrorReports.save')}
        </Button>
      </AutoForm>
    </StyledErrorReportEditor>
  );
}

ErrorReportEditor.defaultProps = {
  doc: {},
};

ErrorReportEditor.propTypes = {
  doc: PropTypes.object,
};

export default ErrorReportEditor;
