import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import modal from 'antd/lib/modal';
import message from 'antd/lib/message';

import { errorReports as errorReportsQuery } from '../queries/ErrorReports.gql';
import { removeErrorReport as removeErrorReportMutation } from '../mutations/ErrorReports.gql';

function RemoveErrorReportButton({ _id, message, ...props }) {
  const history = useHistory();
  const [removeErrorReport] = useMutation(removeErrorReportMutation, {
    ignoreResults: true,
    onCompleted: () => {
      message.success(i18n.__('ErrorReports.error_report_saved'));
      history.push('/error-reports');
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
      cancelText: i18n.__('ErrorReports.cancel'),
    });
  }

  return (
    <Button key={_id} type="danger" onClick={showConfirmModal} {...props}>
      {i18n.__('ErrorReports.remove_error_report')}
    </Button>
  );
}

RemoveErrorReportButton.propTypes = {
  _id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default RemoveErrorReportButton;
