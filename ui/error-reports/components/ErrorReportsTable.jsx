import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import isString from 'lodash/isString';
import i18n from 'meteor/universe:i18n';
import { useHistory } from 'react-router-dom';
import hasRole from '../../../modules/hasRole';
import useQueryStringObject from '../../../modules/hooks/useQueryStringObject';
import PrettyDate from '../../components/PrettyDate';
import NewErrorReportButton from './NewErrorReportButton';

// import StyledErrorReportsTable from './StyledErrorReportsTable';

import { errorReports as errorReportsQuery } from '../queries/ErrorReports.gql';

const { Search } = Input;

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
  ...props
}) {
  const history = useHistory();

  const [queryStringObject, setQueryStringObject] = useQueryStringObject(queryKeyPrefix);
  const { level, order, page, pageSize, search, sort } = { ...props, ...queryStringObject };

  const paginationObject = {
    pageSize,
    //  onChange: this.onPageChange,
  };

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
      sort: currentSort,
      order: currentOrder,
      search: currentSearch,
      level: currentLevel,
    },
  });

  const columns = [
    {
      title: i18n.__('ErrorReports.user'),
      dataIndex: ['user', 'fullName'],
    },
    {
      title: i18n.__('ErrorReports.level'),
      dataIndex: 'level',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'level' && currentOrder,
      render: (value, record) => i18n.__(`ErrorReports.level_${value}`), // eslint-disable-line
      filteredValue: currentLevel,
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
      title: i18n.__('ErrorReports.created_at_utc'),
      dataIndex: 'createdAtUTC',
      sorter: true,
      defaultSortOrder: 'descend',
      sortOrder: currentSort === 'createdAtUTC' && currentOrder,
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

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'createdAtUTC';

    setCurrentPage(pagination.current);
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);
    setCurrentLevel(newLevel);

    setQueryStringObject({
      page: pagination.current,
      sort: currentField,
      order: sorter.order,
      level: newLevel,
    });
  }

  function handleTableRow(record) {
    return {
      onClick: () => {
        history.push(`/error-reports/${record._id}`);
      },
    };
  }

  return (
    <>
      <p>
        {showNewErrorReportButton && hasRole(roles, ['admin']) && <NewErrorReportButton />}&nbsp;
        {showSearch && (
          <span className="pull-right" style={{ width: 300 }}>
            <Search
              placeholder={i18n.__('ErrorReports.search_placeholder')}
              onSearch={handleSearch}
              defaultValue={currentSearch}
              allowClear
              enterButton
            />
          </span>
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
      />
    </>
  );
}

ErrorReportsTable.defaultProps = {
  showNewErrorReportButton: false,
  queryKeyPrefix: undefined,
  pageSize: 10,
  page: 1,
  sort: 'createdAtUTC',
  order: 'descend',
  search: undefined,
  showSearch: true,
  level: undefined,
};

ErrorReportsTable.propTypes = {
  roles: PropTypes.array.isRequired,
  showNewErrorReportButton: PropTypes.bool,
  queryKeyPrefix: PropTypes.string,
  pageSize: PropTypes.number,
  page: PropTypes.number,
  sort: PropTypes.string,
  order: PropTypes.string,
  search: PropTypes.string,
  showSearch: PropTypes.bool,
};

export default ErrorReportsTable;
