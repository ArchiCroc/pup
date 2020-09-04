import React from 'react';
import Row from 'antd/lib/row';
import Column from 'antd/lib/col';

const PageContainer = ({ children, className = null }) => <Row justify="center">{children}</Row>;

export default PageContainer;
