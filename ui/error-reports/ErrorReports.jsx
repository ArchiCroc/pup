import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import Table from 'antd/lib/table';
import PageHeader from '../components/PageHeader';
import PrettyDate from '../components/PrettyDate';

import NewErrorReportButton from './components/NewErrorReportButton';

import StyledErrorReports from './StyledErrorReports';

import { errorReports as errorReportsQuery } from './queries/ErrorReports.gql';

const ErrorReports = ({ history }) => {
  const { loading, data: { errorReports } = {} } = useQuery(errorReportsQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const columns = [
    {
      title: i18n.__('ErrorReports.level'),
      dataIndex: 'level',
      render: (value, record) => i18n.__(`ErrorReports.level_${value}`), // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.message'),
      dataIndex: 'message',
      sorter: (a, b) => a.message.localeCompare(b.message),
      defaultSortOrder: 'ascend',
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.path'),
      dataIndex: 'path',
      sorter: (a, b) => a.path.localeCompare(b.path),
      defaultSortOrder: 'ascend',
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.trace'),
      dataIndex: 'trace',
    },
    {
      title: i18n.__('ErrorReports.created_at_utc'),
      dataIndex: 'createdAtUTC',
      sorter: (a, b) => new Date(a.createdAtUTC).getTime() - new Date(b.createdAtUTC).getTime(),
      defaultSortOrder: 'descend',
      render: (createdAtUTC) => <PrettyDate timestamp={createdAtUTC} />, // eslint-disable-line
    },
  ];

  const handleOnRow = (record) => {
    return {
      onClick: () => {
        history.push(`/error-reports/${record._id}`);
      },
    };
  };

  return (
    <StyledErrorReports>
      <PageHeader title={i18n.__('ErrorReports.error_report_plural')} />
      <NewErrorReportButton />
      <Table
        dataSource={errorReports}
        columns={columns}
        rowKey="_id"
        rowClassName="clickable"
        onRow={handleOnRow}
        pagination={false}
        loading={loading}
      />
    </StyledErrorReports>
  );
};

ErrorReports.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ErrorReports;
