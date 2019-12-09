import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import AntdBreadcrumb from 'antd/lib/breadcrumb';

class BreadcrumbItem extends AntdBreadcrumb.Item {
  render() {
    const { to, children } = this.props;
    return (
      <AntdBreadcrumb.Item key={to}>
        {to ? <Link to={to}>{children}</Link> : children}
      </AntdBreadcrumb.Item>
    );
  }
}

BreadcrumbItem.defaultProps = {
  to: undefined,
};

BreadcrumbItem.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export const Breadcrumb = BreadcrumbItem;

export default function PageBreadcrumbs({ children }) {
  return (
    <AntdBreadcrumb>
      <Breadcrumb to="/">{i18n.__('home')}</Breadcrumb>
      {children}
    </AntdBreadcrumb>
  );
}
PageBreadcrumbs.defaultProps = {
  children: undefined,
};
PageBreadcrumbs.propTypes = {
  children: PropTypes.node,
};
