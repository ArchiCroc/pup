import React from 'react';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import EditIcon from '@ant-design/icons/EditOutlined';
import { LinkContainer } from 'react-router-bootstrap';

interface EditErrorReportButtonProps {
  _id: string
}

const EditErrorReportButton = ({ _id, ...props }: EditErrorReportButtonProps) => (
  <LinkContainer to={`/admin/error-reports/${_id}/edit`}>
    <Button type="primary" icon={<EditIcon />}>
      {i18n.__('ErrorReports.edit_error_report')}
    </Button>
  </LinkContainer>
);

export default EditErrorReportButton;
