import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import { LinkContainer } from 'react-router-bootstrap';

const NewErrorReportButton = (props) => (
  <LinkContainer to="/error-reports/new">
    <Button type="primary" icon="plus" {...props} >
      {i18n.__('ErrorReports.new_error_report')}
    </Button>
  </LinkContainer>
);

NewErrorReportButton.defaultProps = {
  className: undefined,
  disabled: false,
};

NewErrorReportButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default NewErrorReportButton;
