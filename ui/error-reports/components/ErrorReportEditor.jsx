/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import { useHistory } from 'react-router-dom';
import { HiddenField, ListField, TextField } from 'uniforms-antd';
import AutoForm from '../../components/AutoForm';
import CrossReferenceSearchField from '../../components/CrossReferenceSearchField';
import ListInlineItemField from '../../components/ListInlineItemField';
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
      history.push('/admin/error-reports');
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: errorReportsQuery }],
  });

  function handleSubmit(form) {
    const cleanForm = ErrorReportSchema.clean(form);
    saveErrorReport({
      variables: { errorReport: cleanForm },
    });
  }

  return (
    <StyledErrorReportEditor>
      <AutoForm name="errorReport" schema={ErrorReportSchema} onSubmit={handleSubmit} model={doc}>
        <HiddenField name="_id" />
        <CrossReferenceSearchField name="userId" />
        <SelectField name="level" />
        <TextField name="message" />
        <TextField name="path" />
        <TextField name="userAgent" />
        <ListField name="stack" initialCount={1}>
          <ListInlineItemField name="$">
            <TextField name="" />
          </ListInlineItemField>
        </ListField>
        <ListField name="reactStack" initialCount={1}>
          <ListInlineItemField name="$">
            <TextField name="" />
          </ListInlineItemField>
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
