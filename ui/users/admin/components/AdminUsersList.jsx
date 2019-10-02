import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import queryString from 'query-string';
import Table from 'antd/lib/table';
import { useQuery } from '@apollo/react-hooks';
import i18n from 'meteor/universe:i18n';
// import Loading from '../../components/Loading';
import { users as usersQuery } from '../../queries/Users.gql';

// import { StyledListGroup, StyledListGroupItem } from './StyledAdminUsersList';

// @todo filter these
// @ todo add status and account creation date

const AdminUsersList = ({ history }) => {
  const paginationObject = {
    pageSize: 10,
    //  onChange: this.onPageChange,
  };

  const columns = [
    {
      title: () => i18n.__('Users.name'),
      dataIndex: 'profile',
      key: 'name',
      sorter: true,
      // sortOrder: 'ascend',
      render: (profile) => `${profile.firstName} ${profile.lastName}`,
      // {name ? `${firstName} ${lastName}` : username}
    },
    {
      title: () => i18n.__('Users.email_address'),
      dataIndex: 'emailAddress',
      sorter: true,
    },
    {
      title: 'Users.source',
      dataIndex: 'oAuthProvider',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState(null);
  const [currentSort, setCurrentSort] = useState('name');
  const [currentOrder, setCurrentOrder] = useState('descend');

  const { loading, error, data: { users } = {} } = useQuery(usersQuery, {
    fetchPolicy: 'no-cache',
    variables: {
      pageSize: paginationObject.pageSize,
      page: currentPage,
      search: currentSearch,
      sort: currentSort,
      order: currentOrder,
    },
  });

  // complete paginationObject
  if (users && users.users) {
    paginationObject.total = users.total;
    paginationObject.current = currentPage;
  }

  function onRowClick(row) {
    // console.log('onRowClick', row);
    history.push(`${window.location.pathname}/${row._id}`);
  }

  function onTableChange(pagination, filters, sorter) {
    // console.log(pagination, filters, sorter);
    const { roles: newRoles = null } = filters;

    const currentField = sorter.field ? sorter.field.split('.')[0] : 'name';

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
          roles: newRoles,
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
        onChange={onTableChange}
        rowClassName="clickable"
        onRow={(record) => ({
          onClick: () => onRowClick(record),
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
  // search: PropTypes.string,
  // pageSize: PropTypes.number.isRequired,
  // currentPage: PropTypes.number.isRequired,
  // onChangePage: PropTypes.func.isRequired,
};

export default AdminUsersList;
