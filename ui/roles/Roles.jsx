import React, { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import Input from 'antd/lib/input';
import Table from 'antd/lib/table';
import hasRole from '../../modules/hasRole';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import PrettyDate from '../components/PrettyDate';
import NewRoleButton from './components/NewRoleButton';
import StyledRoles from './StyledRoles';

import { roles as rolesQuery } from './queries/Roles.gql';

const { Search } = Input;

function Roles({ roles: userRoles }) {
  const history = useHistory();
  const location = useLocation();

  const {
    pageSize = 10,
    page = 1,
    sort = 'name',
    order = 'ascend',
    search = null,
  } = queryString.parse(location.search, { arrayFormat: 'comma' });

  const paginationObject = {
    pageSize,
    //  onChange: this.onPageChange,
  };

  const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
  const [currentSort, setCurrentSort] = useState(sort);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [currentSearch, setCurrentSearch] = useState(search);

  const { loading, data: { roles } = {} } = useQuery(rolesQuery, {
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
      render: (createdAtUTC) => <PrettyDate timestamp={createdAtUTC} />, // eslint-disable-line
    },
    {
      title: i18n.__('Roles.updated_at_utc'),
      dataIndex: 'updatedAtUTC',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (updatedAtUTC) => <PrettyDate timestamp={updatedAtUTC} />, // eslint-disable-line
    },
  ];

  // complete paginationObject
  if (roles && roles.roles) {
    paginationObject.total = roles.total;
    paginationObject.current = currentPage;
  }
  function handleSearch(value) {
    setCurrentSearch(value);
    history.push({
      pathname: window.location.pathname,
      search: `?${queryString.stringify(
        {
          page: currentPage,
          sort: currentSort,
          order: currentOrder,
          search: value,
        },
        { arrayFormat: 'comma' },
      )}`,
    });
  }

  function handleTableChange(pagination, filters, sorter) {
    const currentField = sorter.field ? sorter.field.split('.')[0] : 'createdAtUTC';

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
          search: currentSearch,
        },
        { arrayFormat: 'comma' },
      )}`,
    });
  }

  function handleTableRow(record) {
    return {
      onClick: () => {
        history.push(`/roles/${record.name}`);
      },
    };
  }

  return (
    <StyledRoles>
      <PageBreadcrumbs>
        <Breadcrumb>{i18n.__('Roles.role_plural')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('Roles.role_plural')} />
      <p>
        {hasRole(userRoles, ['admin']) && <NewRoleButton />}
        <span className="pull-right" style={{ width: 300 }}>
          <Search
            placeholder={i18n.__('Roles.search_placeholder')}
            onSearch={handleSearch}
            defaultValue={currentSearch}
            allowClear
            enterButton
          />
        </span>
      </p>
      <Table
        columns={columns}
        dataSource={roles && roles.roles}
        loading={loading}
        onChange={handleTableChange}
        onRow={handleTableRow}
        rowKey="_id"
        pagination={paginationObject}
        rowClassName="clickable"
      />
    </StyledRoles>
  );
}

Roles.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default Roles;
