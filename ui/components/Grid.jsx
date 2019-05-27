import React from 'react';
import Row from 'antd/lib/row';
import Column from 'antd/lib/col';

const Grid = ({ children }) => (
  <Row type="flex" justify="center">
    <Column xs={24} sm={24} md={18} lg={16}>
      {children}
    </Column>
  </Row>
);

export default Grid;
