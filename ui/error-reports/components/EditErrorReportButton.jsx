import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import { LinkContainer } from 'react-router-bootstrap';

const EditErrorReportButton = ({ _id, ...props }) => (
  <LinkContainer to={`/error-reports/${_id}/edit`}>
    <Button type="primary" icon="edit" {...props}>
      {i18n.__('ErrorReports.edit_error_report')}
    </Button>
  </LinkContainer>
);

EditErrorReportButton.propTypes = {
  _id: PropTypes.string.isRequired,
};

export default EditErrorReportButton;
