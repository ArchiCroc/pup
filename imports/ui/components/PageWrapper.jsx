import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Column from 'antd/lib/col';

const PageWrapper = ({ children, ...props }) => <Column {...props}>{children}</Column>;

PageWrapper.propTypes = {
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  children: PropTypes.node.isRequired,
};

PageWrapper.defaultProps = {
  xs: 24,
  sm: 24,
  md: 18,
  lg: 16,
  xl: undefined,
};

const StyledPageWrapper = styled(PageWrapper)`
  padding: 20px 40px;
  background-color: #fff;
`;

export default StyledPageWrapper;
