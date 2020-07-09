import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import i18n from 'meteor/universe:i18n';
import { useHistory } from 'react-router-dom';
import hasRole from '../../../modules/hasRole';
import useQueryStringObject from '../../../modules/hooks/useQueryStringObject';
import PrettyDate from '../../components/PrettyDate';
import NewRoleButton from './NewRoleButton';

// import StyledRolesTable from './StyledRolesTable';

import { roles as rolesQuery } from '../queries/Roles.gql';

const { Search } = Input;

function RolesTable({ queryKeyPrefix, roles, showNewRoleButton, showSearch, ...props }) {
  const history = useHistory();

  const [queryStringObject, setQueryStringObject] = useQueryStringObject(queryKeyPrefix);
  const { order, page, pageSize, search, sort } = { ...props, ...queryStringObject };

  const paginationObject = {
    pageSize,
    //  onChange: this.onPageChange,
  };

  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [currentSearch, setCurrentSearch] = useState(search);

  const { loading, data: { roles: userRoles } = {} } = useQuery(rolesQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      pageSize: paginationObject.pageSize,
      page: currentPage,
      sort: currentSort,
      order: currentOrder,
      search: currentSearch,
    },
  });

  const columns = [
    {
      title: i18n.__('Roles.name'),
      dataIndex: 'name',
      sorter: true,
      defaultSortOrder: 'ascend',
      // render: (value, record) => <Link to={`/roles/${record.name}/edit`}>{value}</Link>, // eslint-disable-line
    },
    {
      title: i18n.__('Roles.created_at_utc'),
      dataIndex: 'createdAtUTC',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (value, record) => <PrettyDate timestamp={value} />, // eslint-disable-line
    },
    {
      title: i18n.__('Roles.updated_at_utc'),
      dataIndex: 'updatedAtUTC',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (value, record) => <PrettyDate timestamp={value} />, // eslint-disable-line
    },
  ];

  // complete paginationObject
  if (userRoles && userRoles.roles) {
    paginationObject.total = userRoles.total;
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
    setCurrentOrder(sorter.order);
    setCurrentSort(sorter.field);

    setQueryStringObject({
      page: pagination.current,
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
        {showNewRoleButton && hasRole(roles, ['admin']) && <NewRoleButton />}&nbsp;
        {showSearch && (
          <span className="pull-right" style={{ width: 300 }}>
            <Search
              placeholder={i18n.__('Roles.search_placeholder')}
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
        dataSource={userRoles?.roles}
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

RolesTable.defaultProps = {
  showNewRoleButton: false,
  queryKeyPrefix: undefined,
  pageSize: 10,
  page: 1,
  sort: 'name',
  order: 'ascend',
  search: undefined,
  showSearch: true,
};

RolesTable.propTypes = {
  roles: PropTypes.array.isRequired,
  showNewRoleButton: PropTypes.bool,
  queryKeyPrefix: PropTypes.string,
  pageSize: PropTypes.number,
  page: PropTypes.number,
  sort: PropTypes.string,
  order: PropTypes.string,
  search: PropTypes.string,
  showSearch: PropTypes.bool,
};

export default RolesTable;
