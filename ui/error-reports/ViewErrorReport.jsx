import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import PageHeader from '../components/PageHeader';
import Loading from '../components/Loading';
import NotFound from '../pages/NotFound';

import EditErrorReportButton from './components/EditErrorReportButton'

import { errorReport as errorReportQuery } from './queries/ErrorReports.gql';

import StyledViewErrorReport from './StyledViewErrorReport';

const ViewErrorReport = ({ match }) => {
  const { loading, data: { errorReport } = {} } = useQuery(errorReportQuery, { variables: { _id: match.params._id } });

  return (
    <StyledViewErrorReport>
      <PageHeader title={i18n.__('ErrorReports.view_error_report')} />
      {errorReport && <EditErrorReportButton _id={errorReport._id} />}
      <Row>
        <Col xs={24} sm={16} md={12} lg={8}>
          {loading ? (
            <Loading />
          ) : (
            <>{errorReport ? <ViewErrorReportFields errorReport={errorReport} /> : <NotFound />}</>
          )}
        </Col>
      </Row>
    </StyledViewErrorReport>
  );
};

ViewErrorReport.propTypes = {
  // history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const ViewErrorReportFields = ({ errorReport }) => {
  return (
    <>
      {Object.entries(errorReport).map(([label, value]) => (
        <ViewErrorReportField key={label} label={label} value={value} />
      ))}
    </>
  );
};

ViewErrorReportFields.propTypes = {
  errorReport: PropTypes.object.isRequired,
};

const ViewErrorReportField = ({ label, value }) => {
  return (
    <Row>
      <Col xs={12}>{label}</Col>
      <Col xs={12} >{value.toString()}</Col>
    </Row>
  );
};

ViewErrorReportField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
};

export default ViewErrorReport;
