import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import StyledBlankState from './StyledBlankState';

function BlankState({ image, icon, title, subtitle, action }) {
  const Icon = icon;

  return (
    <StyledBlankState>
      {image && <img src={image} alt={title} />}
      {icon && <Icon />}
      <h4>{title}</h4>
      <p>{subtitle}</p>
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
};

BlankState.propTypes = {
  image: PropTypes.string,
  icon: PropTypes.object,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  action: PropTypes.object,
};

export default BlankState;
