import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import StyledBlankState from './StyledBlankState';

function BlankState({ image, icon, title, subtitle, action }) {
  return (
    <StyledBlankState>
      {image && <img src={image} alt={title} />}
      {icon && icon}
      <h4>{title}</h4>
      {subtitle && <p>{subtitle}</p>}
      {action && (
        <Button type={action.style || 'primary'} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </StyledBlankState>
  );
}

BlankState.defaultProps = {
  image: null,
  icon: null,
  action: null,
  subtitle: undefined,
};

BlankState.propTypes = {
  image: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.object,
};

export default BlankState;
