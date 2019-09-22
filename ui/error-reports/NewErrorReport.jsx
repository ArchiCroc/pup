import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import PageHeader from '../components/PageHeader';
import ErrorReportEditor from './components/ErrorReportEditor';

const NewErrorReport = ({ history }) => (
  <>
    <PageHeader title={i18n.__('ErrorReports.new_error_report')} />
    <Row>
      <Col xs={24} sm={16} md={12} lg={8}>
        <ErrorReportEditor history={history} />
      </Col>
    </Row>
  </>
);

NewErrorReport.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewErrorReport;
