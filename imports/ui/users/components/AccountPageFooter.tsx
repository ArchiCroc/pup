import React from 'react';
import StyledAccountPageFooter from './StyledAccountPageFooter';

interface AccountPageFooterProps {
  children: React.ReactNode;
}

const AccountPageFooter = ({ children }: AccountPageFooterProps) => (
  <StyledAccountPageFooter>{children}</StyledAccountPageFooter>
);

export default AccountPageFooter;
