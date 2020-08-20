import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import i18n from 'meteor/universe:i18n';
import { useHistory } from 'react-router-dom';
import hasRole from '../../../../../libs/hasRole';
import useQueryStringObject from '../../../../../libs/hooks/useQueryStringObject';
import PrettyDate from '../../../../components/PrettyDate';
import NewUsersRoleButton from './NewUsersRoleButton';

// import StyledUsersRolesTable from './StyledUsersRolesTable';

import { usersRoles as usersRolesQuery } from '../queries/UsersRoles.gql';

const { Search } = Input;

function UsersRolesTable({
  queryKeyPrefix,
  roles,
  showNewUsersRoleButton,
  showSearch,
  showSizeChanger,
  ...props
}) {
  const history = useHistory();

  const [queryStringObject, setQueryStringObject] = useQueryStringObject(queryKeyPrefix);
  const { order, page, pageSize, search, sort } = { ...props, ...queryStringObject };

  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [currentPageSize, setCurrentPageSize] = useState(parseInt(pageSize, 10));
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [currentSearch, setCurrentSearch] = useState(search);

  const { loading, data: { usersRoles } = {} } = useQuery(usersRolesQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageSize: currentPageSize,
      page: currentPage,
      sort: currentSort,
      order: currentOrder,
      search: currentSearch,
    },
  });

  const paginationObject = {
    currentPageSize,
    // onChange: this.onPageChange,
  };

  const columns = [
    {
      title: i18n.__('UsersRoles.name'),
      dataIndex: 'name',
      sorter: true,
      defaultSortOrder: 'ascend',
      sortOrder: currentSort === 'name' && currentOrder,
      // render: (value, record) => <Link to={`/users-roles/${record.name}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('UsersRoles.created_at_utc'),
      dataIndex: 'createdAtUTC',
      sorter: true,
      sortOrder: currentSort === 'createdAtUTC' && currentOrder,
      render: (value, record) => <PrettyDate timestamp={value} />,
    },
    {
      title: i18n.__('UsersRoles.updated_at_utc'),
      dataIndex: 'updatedAtUTC',
      sorter: true,
      sortOrder: currentSort === 'updatedAtUTC' && currentOrder,
      render: (value, record) => <PrettyDate timestamp={value} />,
    },
  ];

  // complete paginationObject
  if (usersRoles && usersRoles.usersRoles) {
    paginationObject.total = usersRoles.total;
    paginationObject.current = currentPage;
  }
  function handleSearch(value) {
    setCurrentSearch(value);
    setQueryStringObject({
      search: value,
    });
  }

  function handleTableChange(pagination, filters, sorter) {
    const currentField = sorter.field ? sorter.field.split('.')[0] : 'createdAtUTC';

    setCurrentPage(pagination.current);
    setCurrentPageSize(pagination.pageSize);
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);

    setQueryStringObject({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sort: currentField,
      order: sorter.order,
    });
  }

  function handleTableRow(record) {
    return {
      onClick: () => {
        history.push(`/admin/users/roles/${record.name}`);
      },
    };
  }

  return (
    <>
      <p>
        {showNewUsersRoleButton && hasRole(roles, ['admin']) && <NewUsersRoleButton />}&nbsp;
        {showSearch && (
          <span className="pull-right" style={{ width: 300 }}>
            <Search
              placeholder={i18n.__('UsersRoles.search_placeholder')}
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
        dataSource={usersRoles?.usersRoles}
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

UsersRolesTable.defaultProps = {
  showNewUsersRoleButton: false,
  queryKeyPrefix: undefined,
  page: 1,
  pageSize: 10,
  sort: 'name',
  order: 'ascend',
  search: undefined,
  showSearch: true,
  showSizeChanger: true,
};

UsersRolesTable.propTypes = {
  roles: PropTypes.array.isRequired,
  showNewUsersRoleButton: PropTypes.bool,
  queryKeyPrefix: PropTypes.string,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  sort: PropTypes.string,
  order: PropTypes.string,
  search: PropTypes.string,
  showSearch: PropTypes.bool,
  showSizeChanger: PropTypes.bool,
};

export default UsersRolesTable;
