import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import modal from 'antd/lib/modal';
import { useHistory } from 'react-router-dom';

import { errorReports as errorReportsQuery } from '../queries/ErrorReports.gql';
import { removeErrorReport as removeErrorReportMutation } from '../mutations/ErrorReports.gql';

function RemoveErrorReportButton({ _id, message, ...props }) {
  const history = useHistory();

  const [removeErrorReport] = useMutation(removeErrorReportMutation, {
    ignoreResults: true,
    onCompleted: () => {
      message.success(i18n.__('ErrorReports.error_report_saved'));
      history.push('/admin/error-reports');
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: errorReportsQuery }],
    variables: { _id },
  });

  function showConfirmModal() {
    modal.confirm({
      title: i18n.___('ErrorReports.confirm_remove_error_report', { name: message }),
      onOk: removeErrorReport,
      okText: i18n.__('ErrorReports.remove'),
      okType: 'danger',
      okButtonProps: { 'data-testid': 'remove-error-report-ok-button' },
      cancelText: i18n.__('ErrorReports.cancel'),
      cancelButtonProps: { 'data-testid': 'remove-error-report-cancel-button' },
    });
  }

  return (
    <Button
      key={_id}
      type="danger"
      onClick={showConfirmModal}
      data-testid="remove-error-report-button"
      {...props}
    >
      {i18n.__('ErrorReports.remove_error_report')}
    </Button>
  );
}

RemoveErrorReportButton.propTypes = {
  _id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default RemoveErrorReportButton;
