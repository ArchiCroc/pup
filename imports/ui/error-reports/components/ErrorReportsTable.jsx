import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Table from 'antd/lib/table';
import isString from 'lodash/isString';
import i18n from 'meteor/universe:i18n';
import { useHistory } from 'react-router-dom';
import hasRole from '/imports/common/libs/hasRole';
import useQueryStringObject from '/imports/ui/libs/hooks/useQueryStringObject';
import PrettyDate from '/imports/ui/components/PrettyDate';
import SearchInput from '/imports/ui/components/SearchInput';
import NewErrorReportButton from './NewErrorReportButton';

// import StyledErrorReportsTable from './StyledErrorReportsTable';

import { errorReports as errorReportsQuery } from '../queries/ErrorReports.gql';

function getLevelFilters() {
  const choices = [0, 1, 2, 3, 4, 5];
  const filters = [];
  for (const choice of choices) {
    filters.push({ text: i18n.__(`ErrorReports.level_${choice}`), value: choice });
  }
  return filters;
}

function ErrorReportsTable({
  queryKeyPrefix,
  roles,
  showNewErrorReportButton,
  showSearch,
  showSizeChanger,
  ...props
}) {
  const history = useHistory();

  const [queryStringObject, setQueryStringObject] = useQueryStringObject(queryKeyPrefix);
  const { level, order, page, pageSize, search, sort } = { ...props, ...queryStringObject };

  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [currentPageSize, setCurrentPageSize] = useState(parseInt(pageSize, 10));
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [currentLevel, setCurrentLevel] = useState(
    level && isString(level) ? [parseInt(level, 10)] : level && level.map(parseInt),
  );

  const { loading, data: { errorReports } = {} } = useQuery(errorReportsQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      page: currentPage,
      pageSize: currentPageSize,
      sort: currentSort,
      order: currentOrder,
      search: currentSearch,
      level: currentLevel,
    },
  });

  const paginationObject = {
    pageSize: currentPageSize,
    // onChange: this.onPageChange,
  };

  const columns = [
    {
      title: i18n.__('ErrorReports.user'),
      dataIndex: ['user', 'fullName'],
    },
    {
      title: i18n.__('ErrorReports.level'),
      dataIndex: 'level',
      sorter: true,
      // defaultSortOrder: 'ascend',
      // render: (value, record) => value, // eslint-disable-line
      sorter: true,
      // defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'level' && currentOrder,
      render: (value, record) => i18n.__(`ErrorReports.level_${value}`), // eslint-disable-line
      filteredValue: currentLevel?.map(String),
      filters: props.level ? undefined : getLevelFilters(),
    },
    {
      title: i18n.__('ErrorReports.message'),
      dataIndex: 'message',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'message' && currentOrder,
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.path'),
      dataIndex: 'path',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'path' && currentOrder,
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.user_agent'),
      dataIndex: 'userAgent',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'userAgent' && currentOrder,
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.created_at'),
      dataIndex: 'createdAt',
      sorter: true,
      sortOrder: currentSort === 'createdAt' && currentOrder,
      render: (value, record) => <PrettyDate timestamp={value} />,
    },
  ];

  // complete paginationObject
  if (errorReports && errorReports.errorReports) {
    paginationObject.total = errorReports.total;
    paginationObject.current = currentPage;
  }
  function handleSearch(value) {
    setCurrentSearch(value);
    setQueryStringObject({
      search: value,
    });
  }

  function handleTableChange(pagination, filters, sorter) {
    const { level: newLevel } = filters;

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'createdAt';

    const $newOrder = sorter.order ? sorter.order : null;

    setCurrentPage(pagination.current);
    setCurrentPageSize(pagination.pageSize);
    setCurrentOrder($newOrder);
    setCurrentSort(sorter.field);
    setCurrentLevel(newLevel?.map((x) => parseInt(x, 10)));

    setQueryStringObject({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sort: currentField,
      order: $newOrder,
      level: newLevel,
    });
  }

  function handleTableRow(record) {
    return {
      onClick: () => {
        history.push(`/admin/error-reports/${record._id}`);
      },
    };
  }

  return (
    <>
      <p>
        {showNewErrorReportButton && hasRole(roles, ['admin']) && <NewErrorReportButton />}&nbsp;
        {showSearch && (
          <SearchInput
            className="pull-right"
            style={{ width: 300 }}
            placeholder={i18n.__('ErrorReports.search_placeholder')}
            onSearch={handleSearch}
            defaultValue={currentSearch}
          />
        )}
      </p>
      <Table
        columns={columns}
        dataSource={errorReports?.errorReports}
        loading={loading}
        onChange={handleTableChange}
        onRow={handleTableRow}
        rowKey="_id"
        pagination={paginationObject}
        rowClassName="clickable"
        showSizeChanger={showSizeChanger}
      />
    </>
  );
}

ErrorReportsTable.defaultProps = {
  showNewErrorReportButton: false,
  queryKeyPrefix: undefined,
  page: 1,
  pageSize: 10,
  sort: 'createdAt',
  order: 'descend',
  search: undefined,
  showSearch: true,
  showSizeChanger: true,
  level: undefined,
};

ErrorReportsTable.propTypes = {
  roles: PropTypes.array.isRequired,
  showNewErrorReportButton: PropTypes.bool,
  queryKeyPrefix: PropTypes.string,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  sort: PropTypes.string,
  order: PropTypes.string,
  search: PropTypes.string,
  showSearch: PropTypes.bool,
  showSizeChanger: PropTypes.bool,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
};

export default ErrorReportsTable;
