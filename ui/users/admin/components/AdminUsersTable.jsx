import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
// import { Roles } from 'meteor/alanning:roles';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import useQueryStringObject from '../../../../modules/hooks/useQueryStringObject';
import isString from 'lodash/isString';
import Table from 'antd/lib/table';

import { users as usersQuery } from '../../queries/Users.gql';

// import { StyledListGroup, StyledListGroupItem } from './StyledAdminUsersList';

// @todo filter these
// @ todo add status and account creation date

function AdminUsersList({
  queryKeyPrefix,
  showNewUserButton,
  showSearch,
  showSizeChanger,
  ...props
}) {
  const history = useHistory();

  const [queryStringObject, setQueryStringObject] = useQueryStringObject(queryKeyPrefix);
  const { order, page, pageSize, roles, search, sort } = { ...props, ...queryStringObject };

  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [currentPageSize, setCurrentPageSize] = useState(parseInt(pageSize, 10));
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [currentRoles, setCurrentRoles] = useState(roles && isString(roles) ? [roles] : roles);

  const paginationObject = {
    pageSize: currentPageSize,
    //  onChange: this.onPageChange,
  };

  const columns = [
    {
      title: () => i18n.__('Users.name'),
      dataIndex: 'fullName',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'fullName' && currentOrder,
    },
    {
      title: () => i18n.__('Users.email_address'),
      dataIndex: 'emailAddress',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'emailAddress' && currentOrder,
    },
    {
      title: () => i18n.__('Users.role_plural'),
      dataIndex: 'roles',
      filteredValue: currentRoles,
      // filters: Roles.getAllRoles().fetch(),
      filters: ['user', 'admin', 'api'].map((item) => ({ text: item, value: item })),
      sorter: true,
      defaultSortOrder: 'roles',
      sortOrder: currentSort === 'fullName' && currentOrder,
      // render: (item) => item && item.map((item2) => item2.name).join(', '),
      render: (item) => item && item.join(', '),
    },
  ];

  const { loading, error, data: { users } = {} } = useQuery(usersQuery, {
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

  function handleRowClick(row) {
    // console.log('handleRowClick', row);
    history.push(`${window.location.pathname}/${row._id}`);
  }

  function handleTableChange(pagination, filters, sorter) {
    // console.log(pagination, filters, sorter);
    const { roles: newRoles = null } = filters;

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'name';

    setCurrentPage(pagination.current);
    setCurrentPageSize(pagination.pageSize);
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);
    setCurrentRoles(newRoles);

    setQueryStringObject({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sort: currentField,
      order: sorter.order === false && null,
      roles: newRoles,
    });
  }

  return (
    <>
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

AdminUsersList.defaultProps = {
  showNewUserButton: false,
  queryKeyPrefix: undefined,
  page: 1,
  pageSize: 10,
  sort: 'fullName',
  order: 'ascend',
  search: undefined,
  showSearch: true,
  showSizeChanger: true,
  roles: undefined,
};

AdminUsersList.propTypes = {
  roles: PropTypes.array,
  showNewUserButton: PropTypes.bool,
  queryKeyPrefix: PropTypes.string,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  sort: PropTypes.string,
  order: PropTypes.string,
  search: PropTypes.string,
  showSearch: PropTypes.bool,
  showSizeChanger: PropTypes.bool,
};

export default AdminUsersList;
