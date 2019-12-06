import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import PageHeader from '../components/PageHeader';
import ErrorReportEditor from './components/ErrorReportEditor';

import StyledErrorReports from './StyledErrorReports';

const NewErrorReport = ({ history }) => (
  <StyledErrorReports md={16} lg={12} xl={10} xxl={8}>
    <PageHeader title={i18n.__('ErrorReports.new_error_report')} />
    <ErrorReportEditor history={history} />
  </StyledErrorReports>
);

NewErrorReport.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewErrorReport;
