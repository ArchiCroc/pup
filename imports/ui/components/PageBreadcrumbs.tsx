import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import AntdBreadcrumb from 'antd/lib/breadcrumb';

// class BreadcrumbItem extends AntdBreadcrumb.Item {
//   render() {
//     const { to, children } = this.props;
//     return (
//       <AntdBreadcrumb.Item key={to}>
//         {to ? <Link to={to}>{children}</Link> : children}
//       </AntdBreadcrumb.Item>
//     );
//   }
// }

interface BreadcrumbItemProps {
  to?: string
  children: React.ReactNode
}

function BreadcrumbItem({ to, children, ...props }: BreadcrumbItemProps) {
  return (
    <AntdBreadcrumb.Item key={to} {...props}>
      {to ? <Link to={to}>{children}</Link> : children}
    </AntdBreadcrumb.Item>
  );
}

// get mother element to accept this custom child element
BreadcrumbItem.__ANT_BREADCRUMB_ITEM = true; // eslint-disable-line

export const Breadcrumb = BreadcrumbItem;

interface PageBreadcrumbsProps {
  children: React.ReactNode
}

export default function PageBreadcrumbs({ children = null }: PageBreadcrumbsProps) {
  return (
    <AntdBreadcrumb>
      <Breadcrumb to="/">{i18n.__('home')}</Breadcrumb>
      {children}
    </AntdBreadcrumb>
  );
}

