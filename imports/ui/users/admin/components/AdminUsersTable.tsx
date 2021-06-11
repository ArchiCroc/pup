import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
// import { Roles } from 'meteor/alanning:roles';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/client';
import isString from 'lodash/isString';
import Table from 'antd/lib/table';
import { ColumnsType, SortOrder } from 'antd/lib/table/interface';
import useQueryStringObject from '/imports/ui/libs/hooks/useQueryStringObject';
import SearchInput from '/imports/ui/components/SearchInput';
import { User, RoleSlug } from '/imports/common/Users/interfaces';

import { USERS_QUERY } from '../../graphql/queries.gql';

// import { StyledListGroup, StyledListGroupItem } from './StyledAdminUsersList';

// @todo filter these
// @ todo add status and account creation date
interface AdminUsersTableQueryString {
  page?: string | number;
  pageSize?: string | number;
  sort?: string;
  order?: SortOrder;
  search?: string;
  roles?: string | string[];
}

interface AdminUsersTableProps extends AdminUsersTableQueryString {
  showNewErrorReportButton?: boolean;
  queryKeyPrefix?: string;
  showSearch?: boolean;
  showSizeChanger?: boolean;
}


function AdminUsersTable({
  queryKeyPrefix,
  showNewErrorReportButton = false,
  showSearch = true,
  showSizeChanger = true,
  ...props
}: AdminUsersTableProps) {
  const history = useHistory();

  const [queryStringObject, setQueryStringObject] = useQueryStringObject<AdminUsersTableQueryString>(queryKeyPrefix);
  const { roles, search, page = 1, pageSize = 10, sort = 'createdAt', order = 'descend' } = { ...props, ...queryStringObject };

  const [currentPage, setCurrentPage] = useState(isString(page) ? parseInt(page, 10) : page);
  const [currentPageSize, setCurrentPageSize] = useState(isString(pageSize) ? parseInt(pageSize, 10) : pageSize);
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState<SortOrder>(order);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [currentRoles, setCurrentRoles] = useState(roles && isString(roles) ? [roles] : roles);

  const paginationObject = {
    pageSize: currentPageSize,
    total: undefined,
    current: currentPage,
    // onChange: this.onPageChange,
  };

  const columns: ColumnsType<User> = [
    {
      title: () => i18n.__('Users.name'),
      dataIndex: 'fullName',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'fullName' ? currentOrder : undefined,
    },
    {
      title: () => i18n.__('Users.email_address'),
      dataIndex: 'emailAddress',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'emailAddress' ? currentOrder : undefined,
    },
    {
      title: () => i18n.__('Users.role_plural'),
      dataIndex: 'roles',
      filteredValue: currentRoles,
      // filters: Roles.getAllRoles().fetch(),
      filters: ['user', 'admin', 'api'].map((item) => ({ text: item, value: item })),
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'fullName' ? currentOrder : undefined,
      // render: (item) => item && item.map((item2) => item2.name).join(', '),
      render: (item) => item && item.join(', '),
    },
  ];

  const { loading, error, data: { users } = {} } = useQuery(USERS_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      pageSize: paginationObject.pageSize,
      page: currentPage,
      search: currentSearch,
      sort: currentSort,
      order: currentOrder,
      roles: currentRoles,
    },
  });

  // complete paginationObject
  if (users && users.users) {
    paginationObject.total = users.total;
    paginationObject.current = currentPage;
  }

  function handleRowClick(row: User) {
    // console.log('handleRowClick', row);
    history.push(`${window.location.pathname}/${row._id}`);
  }

  function handleSearch(value: string) {
    setCurrentSearch(value);
    setQueryStringObject({
      search: value,
    });
  }

  function handleTableChange(pagination: any, filters: any, sorter: any) {
    // console.log(pagination, filters, sorter);
    const { roles: newRoles = null } = filters;

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'name';

    const $newOrder = sorter.order ? sorter.order : null;

    setCurrentPage(pagination.current);
    setCurrentPageSize(pagination.pageSize);
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);
    setCurrentRoles(newRoles);

    setQueryStringObject({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sort: currentField,
      order: $newOrder,
      roles: newRoles,
    });
  }

  return (
    <>
      <div style={{ minHeight: 32, marginBottom: 16 }}>
        {showSearch && (
          <SearchInput
            className="pull-right"
            style={{ width: 300 }}
            placeholder={i18n.__('Users.search_placeholder')}
            onSearch={handleSearch}
            defaultValue={currentSearch}
          />
        )}
      </div>
      {error && `Error! ${error.message}`}
      <Table
        dataSource={users && users.users}
        columns={columns}
        rowKey="_id"
        pagination={paginationObject}
        loading={loading}
        onChange={handleTableChange}
        rowClassName="clickable"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </>
  );
}

// AdminUsersTable.defaultProps = {
//   showNewUserButton: false,
//   queryKeyPrefix: undefined,
//   page: 1,
//   pageSize: 10,
//   sort: 'fullName',
//   order: 'ascend',
//   search: undefined,
//   showSearch: true,
//   showSizeChanger: true,
//   roles: undefined,
// };

// AdminUsersTable.propTypes = {
//   roles: PropTypes.array,
//   showNewUserButton: PropTypes.bool,
//   queryKeyPrefix: PropTypes.string,
//   page: PropTypes.number,
//   pageSize: PropTypes.number,
//   sort: PropTypes.string,
//   order: PropTypes.string,
//   search: PropTypes.string,
//   showSearch: PropTypes.bool,
//   showSizeChanger: PropTypes.bool,
// };

export default AdminUsersTable;
