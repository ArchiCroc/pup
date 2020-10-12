/* eslint-disable react/no-danger */

import React from 'react';
import PropTypes from 'prop-types';

function ValueWrapper({ name, value, children, ...props }) {
  // return (
  //   <>
  //     <br />
  //     {children}
  //   </>
  // );
  return <div {...props}>{children}</div>;
}

ValueWrapper.defaultValues = {
  name: undefined,
  testId: undefined,
};

ValueWrapper.propTypes = {
  name: PropTypes.string,
  testId: PropTypes.string,
};

ValueWrapper.displayName = 'ValueWrapper';

export default ValueWrapper;
