import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Table from 'antd/lib/table';
import { Query } from 'react-apollo';
import i18n from 'meteor/universe:i18n';
// import Loading from '../../components/Loading';
import { users as usersQuery } from '../../users/queries/Users.gql';

// import { StyledListGroup, StyledListGroupItem } from './StyledAdminUsersList';

// @todo filter these
// @ todo add status and account creation date

const columns = [
  {
    title: i18n.__('Users.name'),
    dataIndex: 'name',
    sorter: true,
    // sortOrder: 'ascend',
    render: (name) => `${name.first} ${name.last}`,
    // {name ? `${name.first} ${name.last}` : username}
  },
  {
    title: i18n.__('Users.email_address'),
    dataIndex: 'emailAddress',
    sorter: true,
  },
  {
    title: 'Users.source',
    dataIndex: 'oAuthProvider',
  },
];

class AdminUsersList extends React.Component {
  state = {
    currentPage: 1, // currentPage
    search: null,
    sort: 'name',
    order: 'descend',
  };

  // pageSize = 10;

  onPageChange = (page) => {
    this.setState({ currentPage: page });
  };

  onRowClick = (row) => {
    console.log('onRowClick', row);
    this.props.history.push(`/admin/users/${row._id}`);
  };

  onTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
    this.setState({
      currentPage: pagination.current,
      order: sorter.order,
      sort: sorter.field,
    });
  };

  pagination = {
    pageSize: 10,
    //  onChange: this.onPageChange,
  };

  render() {
    const { search, currentPage, sort, order } = this.state;

    return (
      <React.Fragment>
        <Query
          query={usersQuery}
          variables={{
            pageSize: this.pagination.pageSize,
            currentPage,
            search,
            sort,
            order,
          }}
        >
          {({ loading, error, data }) => {
            if (error) return `Error! ${error.message}`;

            if (data.users && data.users.users) {
              this.pagination.total = data.users.total;
              this.pagination.current = currentPage;
              return (
                <Table
                  dataSource={data.users.users}
                  columns={columns}
                  rowKey="_id"
                  pagination={this.pagination}
                  loading={loading}
                  onChange={this.onTableChange}
                  rowClassName="clickable"
                  onRow={(record) => ({
                    onClick: () => this.onRowClick(record),
                  })}
                />
              );
            }
            return null; // @ todo could be blank
          }}
        </Query>
      </React.Fragment>
    );
  }
}

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
