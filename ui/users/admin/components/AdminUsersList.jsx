import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
// import { Link } from 'react-router-dom';
import isString from 'lodash/isString';
import queryString from 'query-string';
import Table from 'antd/lib/table';
import { useQuery } from '@apollo/react-hooks';
import i18n from 'meteor/universe:i18n';
// import Loading from '../../components/Loading';
import { users as usersQuery } from '../../queries/Users.gql';

// import { StyledListGroup, StyledListGroupItem } from './StyledAdminUsersList';

// @todo filter these
// @ todo add status and account creation date

const AdminUsersList = ({ history, location }) => {
  const {
    page = 1,
    sort = 'name',
    order = 'ascend',
    search = null,
    role = null,
  } = queryString.parse(location.search, { arrayFormat: 'comma' });

  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [currentRole, setCurrentRole] = useState(role && isString(role) ? [role] : role);

  const paginationObject = {
    pageSize: 10,
    //  onChange: this.onPageChange,
  };

  const columns = [
    {
      title: () => i18n.__('Users.name'),
      dataIndex: 'fullName',
      defaultSortOrder: 'ascend',
      sorter: true,
    },
    {
      title: () => i18n.__('Users.email_address'),
      dataIndex: 'emailAddress',
      defaultSortOrder: 'ascend',
      sorter: true,
    },
    {
      title: () => i18n.__('Users.role_plural'),
      dataIndex: 'roles',
      defaultSortOrder: 'ascend',
      filteredValue: currentRole,
      //filters: Roles.getAllRoles().fetch(),
      filters: ['user', 'admin', 'api'].map((item) => ({ text: item, value: item })),
      sorter: true,
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
      role: currentRole,
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
    const { roles: newRole = null } = filters;

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'name';

    setCurrentPage(pagination.current);
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);
    setCurrentRole(newRole);

    history.push({
      pathname: window.location.pathname,
      search: `?${queryString.stringify(
        {
          page: pagination.current,
          sort: currentField,
          order: sorter.order,
          role: newRole,
        },
        { arrayFormat: 'comma' },
      )}`,
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
};

// AdminUsersList.defaultProps = {
//   search: '',
// };

AdminUsersList.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default AdminUsersList;
