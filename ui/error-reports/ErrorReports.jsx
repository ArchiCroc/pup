import React, { useState } from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import queryString from 'query-string';
import Table from 'antd/lib/table';
import PageHeader from '../components/PageHeader';
import PrettyDate from '../components/PrettyDate';

import NewErrorReportButton from './components/NewErrorReportButton';

import StyledErrorReports from './StyledErrorReports';

import { errorReports as errorReportsQuery } from './queries/ErrorReports.gql';

const ErrorReports = ({ history }) => {
  const paginationObject = {
    pageSize: 10,
    //  onChange: this.onPageChange,
  };

  const columns = [
    {
      title: i18n.__('ErrorReports.created_at_utc'),
      dataIndex: 'createdAtUTC',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (createdAtUTC) => <PrettyDate timestamp={createdAtUTC} />, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.level'),
      dataIndex: 'level',
      render: (value, record) => i18n.__(`ErrorReports.level_${value}`), // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.message'),
      dataIndex: 'message',
      sorter: true,
      defaultSortOrder: 'ascend',
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.path'),
      dataIndex: 'path',
      sorter: true,
      defaultSortOrder: 'ascend',
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.userAgent'),
      dataIndex: 'userAgent',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState(null);
  const [currentSort, setCurrentSort] = useState('createdAtUTC');
  const [currentOrder, setCurrentOrder] = useState('descend');

  const { loading, data: { errorReports } = {} } = useQuery(errorReportsQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageSize: paginationObject.pageSize,
      page: currentPage,
      search: currentSearch,
      sort: currentSort,
      order: currentOrder,
    },
  });

  // complete paginationObject
  if (errorReports && errorReports.users) {
    paginationObject.total = errorReports.total;
    paginationObject.current = currentPage;
  }

  function handleRowClick(row) {
    history.push(`${window.location.pathname}/${row._id}`);
  }

  function handleTableChange(pagination, filters, sorter) {
    // console.log(pagination, filters, sorter);
    const { levels: newLevels = null } = filters;

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'createdAtUTC';

    setCurrentPage(pagination.current);
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);

    history.push({
      pathname: window.location.pathname,
      search: `?${queryString.stringify(
        {
          page: pagination.current,
          sort: currentField,
          order: sorter.order,
          levels: newLevels,
        },
        { arrayFormat: 'comma' },
      )}`,
    });
  }

  return (
    <StyledErrorReports>
      <PageHeader title={i18n.__('ErrorReports.error_report_plural')} />
      <NewErrorReportButton />
      <Table
        columns={columns}
        dataSource={errorReports && errorReports.errorReports}
        loading={loading}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        pagination={paginationObject}
        rowKey="_id"
        rowClassName="clickable"
      />
    </StyledErrorReports>
  );
};

ErrorReports.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ErrorReports;
