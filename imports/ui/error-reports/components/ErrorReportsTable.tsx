import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Table from 'antd/lib/table';
import { ColumnsType, SortOrder } from 'antd/lib/table/interface';

import isString from 'lodash/isString';
import i18n from 'meteor/universe:i18n';
import { useHistory } from 'react-router-dom';
import hasRole from '/imports/common/libs/hasRole';
import useQueryStringObject from '/imports/ui/libs/hooks/useQueryStringObject';
import PrettyDate from '/imports/ui/components/PrettyDate';
import SearchInput from '/imports/ui/components/SearchInput';
import NewErrorReportButton from './NewErrorReportButton';
import { RoleSlug } from '/imports/common/Users/interfaces';
import { ErrorReport } from '/imports/common/ErrorReports/interfaces';

// import StyledErrorReportsTable from './StyledErrorReportsTable';

import { errorReports as errorReportsQuery } from '../graphql/queries.gql';

function getLevelFilters() {
  const choices = [0, 1, 2, 3, 4, 5];
  const filters = [];
  for (const choice of choices) {
    filters.push({ text: i18n.__(`ErrorReports.level_${choice}`), value: choice });
  }
  return filters;
}

interface ErrorReportsTableQueryString {
  page?: string | number;
  pageSize?: string | number;
  sort?: string;
  order?: SortOrder;
  search?: string;
  level?: number | number[] | string | string[];
}

interface ErrorReportsTableProps extends ErrorReportsTableQueryString {
  roles: RoleSlug[];
  showNewErrorReportButton?: boolean;
  queryKeyPrefix?: string;
  showSearch?: boolean;
  showSizeChanger?: boolean;
}

function ErrorReportsTable({
  queryKeyPrefix,
  roles,
  showNewErrorReportButton = false,
  showSearch = true,
  showSizeChanger = true,
  ...props
}: ErrorReportsTableProps) {
  const history = useHistory();

  const [queryStringObject, setQueryStringObject] = useQueryStringObject<ErrorReportsTableQueryString>(queryKeyPrefix);
  const { level, search, page = 1, pageSize = 10, sort = 'createdAt', order = 'descend', } = { ...props, ...queryStringObject };

  const [currentPage, setCurrentPage] = useState(isString(page) ? parseInt(page, 10) : page);
  const [currentPageSize, setCurrentPageSize] = useState(isString(pageSize) ? parseInt(pageSize, 10) : pageSize);
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState<SortOrder>(order);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [currentLevel, setCurrentLevel] = useState<number[] | undefined>(
    (!Array.isArray(level) ? [level] : level).map((item) => parseInt(String(item), 10)) ,
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
    total: undefined,
    current: currentPage,
    // onChange: this.onPageChange,
  };

  const columns: ColumnsType<ErrorReport> = [
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
      // defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'level' ? currentOrder : undefined,
      render: (value, record) => i18n.__(`ErrorReports.level_${value}`), // eslint-disable-line
      filteredValue: currentLevel?.map(String),
      filters: props.level ? undefined : getLevelFilters(),
    },
    {
      title: i18n.__('ErrorReports.message'),
      dataIndex: 'message',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'message' ? currentOrder : undefined,
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.path'),
      dataIndex: 'path',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'path' ? currentOrder : undefined,
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.user_agent'),
      dataIndex: 'userAgent',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'userAgent' ? currentOrder : undefined,
      // render: (value, record) => <Link to={`/error-reports/${record._id}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('ErrorReports.created_at'),
      dataIndex: 'createdAt',
      sorter: true,
      sortOrder: currentSort === 'createdAt' ? currentOrder : undefined,
      render: (value, record) => <PrettyDate timestamp={value} />,
    },
  ];

  // complete paginationObject
  if (errorReports && errorReports.errorReports) {
    paginationObject.total = errorReports.total;
    paginationObject.current = currentPage;
  }
  function handleSearch(value: string) {
    setCurrentSearch(value);
    setQueryStringObject({
      search: value,
    });
  }

  function handleTableChange(pagination: any, filters: any, sorter: any) {
    const { level: newLevel } = filters;

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'createdAt';

    const $newOrder = sorter.order ? sorter.order : null;

    setCurrentPage(pagination.current);
    setCurrentPageSize(pagination.pageSize);
    setCurrentOrder($newOrder);
    setCurrentSort(sorter.field);
    setCurrentLevel(newLevel?.map((x: any) => parseInt(x, 10)));

    setQueryStringObject({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sort: currentField,
      order: $newOrder,
      level: newLevel,
    });
  }

  function handleTableRow(record: ErrorReport) {
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



export default ErrorReportsTable;
