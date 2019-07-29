import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Table from 'antd/lib/table';
import { useQuery } from '@apollo/react-hooks';
import i18n from 'meteor/universe:i18n';
// import Loading from '../../components/Loading';
import { users as usersQuery } from '../../queries/Users.gql';

// import { StyledListGroup, StyledListGroupItem } from './StyledAdminUsersList';

// @todo filter these
// @ todo add status and account creation date

const columns = [
  {
    title: () => i18n.__('Users.name'),
    dataIndex: 'name',
    sorter: true,
    // sortOrder: 'ascend',
    render: (name) => `${name.first} ${name.last}`,
    // {name ? `${name.first} ${name.last}` : username}
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

const AdminUsersList = ({ history }) => {
  const paginationObject = {
    pageSize: 10,
    //  onChange: this.onPageChange,
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState(null);
  const [currentSort, setCurrentSort] = useState('name');
  const [currentOrder, setCurrentOrder] = useState('descend');

  const { loading, data, error } = useQuery(usersQuery, {
    variables: {
      pageSize: paginationObject.pageSize,
      page: currentPage,
      search: currentSearch,
      sort: currentSort,
      order: currentOrder,
    },
  });

  // complete paginationObject
  if (data.users && data.users.users) {
    paginationObject.total = data.users.total;
    paginationObject.current = currentPage;
  }

  const onRowClick = (row) => {
    console.log('onRowClick', row);
    history.push(`/admin/users/${row._id}`);
  };

  const onTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    setCurrentPage(pagination.current);
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);
  };

  return (
    <React.Fragment>
      {error && `Error! ${error.message}`}
      <Table
        dataSource={data.users && data.users.users && data.users.users}
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
    </React.Fragment>
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
