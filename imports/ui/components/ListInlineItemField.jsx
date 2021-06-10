import React from 'react';
import PropTypes from 'prop-types';
import { connectField } from 'uniforms';
import Input from 'antd/lib/input';

//import AutoField from './AutoField';
import { ListDelField } from 'uniforms-antd';

// const delStyle = {
//   float: 'right',
//   marginBottom: '10px',
//   marginLeft: '10px',
//   marginRight: '6px',
//   width: '20px',
// };

// const itemStyle = { marginBottom: '24px', overflow: 'hidden' };

// const dividerStyle = {
//   borderBottom: '1px solid #DDD',
//   height: '20px',
//   marginTop: '-8px',
// };

// const childrenStyle = { width: '100%' };

function ListInlineItemField({ children, fieldComponent }) {
  const FieldComponent = fieldComponent;
  return (
    <Input.Group style={{ marginTop: 8 }}>
      <ListDelField name="" className="pull-right" style={{ marginLeft: 8, marginTop: 4 }} />
      {FieldComponent ? (
        <FieldComponent label={null} name="" />
      ) : (
        React.cloneElement(React.Children.only(children), { label: null, name: '' })
      )}
      {/* {children} */}
    </Input.Group>
  );
}

ListInlineItemField.defaultProps = {
  fieldComponent: undefined,
};

ListInlineItemField.propTypes = {
  children: PropTypes.node,
  fieldComponent: PropTypes.func,
};

export default connectField(ListInlineItemField);
