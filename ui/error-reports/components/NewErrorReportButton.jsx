import React from 'react';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import PlusIcon from '@ant-design/icons/PlusOutlined';
import { LinkContainer } from 'react-router-bootstrap';

const NewErrorReportButton = (props) => (
  <LinkContainer to="/admin/error-reports/new">
    <Button type="primary" icon={<PlusIcon />} data-testid="new-error-report-button" {...props}>
      {i18n.__('ErrorReports.new_error_report')}
    </Button>
  </LinkContainer>
);

export default NewErrorReportButton;
