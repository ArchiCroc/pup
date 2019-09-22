import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery /* , useMutation */ } from '@apollo/react-hooks';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Divider from 'antd/lib/divider';
import PageHeader from '../components/PageHeader';
import ErrorReportEditor from './components/ErrorReportEditor';
import Loading from '../components/Loading';
import NotFound from '../pages/NotFound';
import RemoveErrorReportButton from './components/RemoveErrorReportButton';

import { editErrorReport as errorReportQuery } from './queries/ErrorReports.gql';

const EditErrorReport = ({ history, match }) => {
  const { loading, data: { errorReport = undefined } = {} } = useQuery(errorReportQuery, { 
    variables: { _id: match.params._id } 
  });

  return (
    <>
      <PageHeader title={i18n.__('ErrorReports.edit_error_report')} />
      <Row>
        <Col xs={24} sm={16} md={12} lg={8}>
          {loading ? (
            <Loading />
          ) : (
            <>{errorReport ? <ErrorReportEditor doc={errorReport} history={history} /> : <NotFound />}</>
          )}
          <Divider />
          {errorReport && <RemoveErrorReportButton _id={errorReport._id} message={errorReport.message} history={history} />}
        </Col>
      </Row>
    </>
  );
};

EditErrorReport.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default EditErrorReport;
