import React, { useState } from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import queryString from 'query-string';
import isString from 'lodash/isString';
import Table from 'antd/lib/table';
import PageHeader from '../components/PageHeader';
import PrettyDate from '../components/PrettyDate';

import NewErrorReportButton from './components/NewErrorReportButton';

import StyledErrorReports from './StyledErrorReports';

import { errorReports as errorReportsQuery } from './queries/ErrorReports.gql';

const ErrorReports = ({ history, location }) => {
  const {
    page = 1,
    sort = 'createdAtUTC',
    order = 'descend',
    search = null,
    level = null,
  } = queryString.parse(location.search, { arrayFormat: 'comma' });

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
      render: (value, record) => (
        <a href={value} target="_blank" onClick={(event) => event.stopPropagation()}>
          {value}
        </a>
      ), // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.userAgent'),
      dataIndex: 'userAgent',
    },
  ];

  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [currentLevel, setCurrentLevel] = useState(
    level && isString(level) ? [parseInt(level, 10)] : level && level.map(parseInt),
  );

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
  if (errorReports && errorReports.errorReports) {
    paginationObject.total = errorReports.total;
    paginationObject.current = currentPage;
  }

  function handleRowClick(row) {
    history.push(`${window.location.pathname}/${row._id}`);
  }

  function handleTableChange(pagination, filters, sorter) {
    const { level: newLevel = null } = filters;

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'createdAtUTC';

    setCurrentPage(pagination.current);
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);
    setCurrentLevel(newLevel);

    history.push({
      pathname: window.location.pathname,
      search: `?${queryString.stringify(
        {
          page: pagination.current,
          sort: currentField,
          order: sorter.order,
          level: newLevel,
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
  location: PropTypes.object.isRequired,
};

export default ErrorReports;
