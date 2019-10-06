import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Descriptions from 'antd/lib/descriptions';
import FormatDate from '../components/FormatDate';
import PageHeader from '../components/PageHeader';
import Loading from '../components/Loading';
import NotFound from '../pages/NotFound';

import EditErrorReportButton from './components/EditErrorReportButton';

import { errorReport as errorReportQuery } from './queries/ErrorReports.gql';

import StyledViewErrorReport from './StyledViewErrorReport';

const ViewErrorReport = ({ match }) => {
  const { loading, data: { errorReport } = {} } = useQuery(errorReportQuery, {
    variables: { _id: match.params._id },
  });

  return (
    <StyledViewErrorReport>
      <PageHeader title={i18n.__('ErrorReports.view_error_report')} />
      {errorReport && (
        <p>
          <EditErrorReportButton _id={errorReport._id} />
        </p>
      )}
      <Row>
        <Col xs={24} sm={24} md={20} lg={16}>
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
    <Descriptions bordered column={1}>
      <Descriptions.Item label={i18n.__('ErrorReports.user')}>
        {errorReport.user && errorReport.user.fullName}
      </Descriptions.Item>
      <Descriptions.Item label={i18n.__('ErrorReports.level')}>
        {i18n.__(`ErrorReports.level_${errorReport.level}`)}
      </Descriptions.Item>
      <Descriptions.Item label={i18n.__('ErrorReports.message')}>
        {errorReport.message}
      </Descriptions.Item>
      <Descriptions.Item label={i18n.__('ErrorReports.path')}>{errorReport.path}</Descriptions.Item>
      <Descriptions.Item label={i18n.__('ErrorReports.user_agent')}>
        {errorReport.userAgent}
      </Descriptions.Item>
      <Descriptions.Item label={i18n.__('ErrorReports.stack')}>
        {errorReport.stack.join(', ')}
      </Descriptions.Item>
      <Descriptions.Item label={i18n.__('ErrorReports.react_stack')}>
        {errorReport.reactStack.join(', ')}
      </Descriptions.Item>
      <Descriptions.Item label={i18n.__('ErrorReports.created_at_utc')}>
        <FormatDate timestamp={errorReport.createdAtUTC} />
      </Descriptions.Item>
      <Descriptions.Item label={i18n.__('ErrorReports.created_by')}>
        {errorReport.createdBy && errorReport.createdBy.fullName}
      </Descriptions.Item>
    </Descriptions>
  );
};

ViewErrorReportFields.propTypes = {
  errorReport: PropTypes.object.isRequired,
};

export default ViewErrorReport;
