import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import modal from 'antd/lib/modal';
import { useHistory } from 'react-router-dom';

import { errorReports as errorReportsQuery } from '../graphql/queries.gql';
import { removeErrorReport as removeErrorReportMutation } from '../graphql/mutations.gql';

function RemoveErrorReportButton({ _id, title, ...props }) {
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
      title: i18n.___('ErrorReports.confirm_remove_error_report', { title }),
      onOk: removeErrorReport,
      okText: i18n.__('ErrorReports.remove'),
      okType: 'danger',
      okButtonProps: { 'data-testid': 'remove-error-report-ok-button' },
      cancelText: i18n.__('ErrorReports.cancel'),
      cancelButtonProps: { 'data-testid': 'remove-error-report-cancel-button' },
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
  title: PropTypes.string.isRequired,
};

export default RemoveErrorReportButton;
