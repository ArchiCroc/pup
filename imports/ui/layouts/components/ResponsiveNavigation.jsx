import React, { useEffect, useState } from 'react';
import { number, string, func, oneOfType, bool, oneOf } from 'prop-types';
import Drawer from 'antd/lib/drawer';
import throttle from 'lodash.throttle';

const ResponsiveNavigation = (props) => {
  const {
    children: MenuMarkup,
    activeLinkKey,
    menuClassName: className,
    theme,
    mode,
    mobileMenuContent,
    placement,
    popoverTrigger,
    throttleViewportChange,
    mobileBreakPoint,
    closeOnClick,
  } = props;

  const [viewportWidth, setViewportWidth] = useState(0);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const isMobile = () => viewportWidth < mobileBreakPoint;
  const onLinkClick = () => () => (isMobile() && closeOnClick ? setIsMenuShown(false) : null);

  useEffect(() => {
    setViewportWidth(window.innerWidth);
    const throttledSetViewPortWidth = throttle(
      () => setViewportWidth(window.innerWidth),
      throttleViewportChange,
    );
    window.addEventListener('resize', throttledSetViewPortWidth);

    return () => window.removeEventListener('resize', throttledSetViewPortWidth);
  }, []);

  const MenuMarkupConfig = {
    theme: !theme ? 'light' : typeof theme === 'function' ? theme(isMobile()) : theme,
    mode: !mode ? 'horizontal' : typeof mode === 'function' ? mode(isMobile()) : mode,
    selectedKeys: [`${activeLinkKey}`],
    className,
  };

  const menuToRender = React.cloneElement(MenuMarkup(onLinkClick()), MenuMarkupConfig);

  return isMobile() ? (
    <Drawer
      content={menuToRender}
      trigger={popoverTrigger}
      placement={placement}
      visible={isMenuShown}
      onVisibleChange={setIsMenuShown}
    >
      {mobileMenuContent(isMenuShown)}
    </Drawer>
  ) : (
    menuToRender
  );
};

ResponsiveNavigation.propTypes = {
  children: func.isRequired,
  mobileBreakPoint: number,
  closeOnMobileLinkClick: bool,
  throttleViewportChange: number,
  activeLinkKey: string,
  placement: string,
  theme: func,
  mode: oneOfType([func, string]),
  mobileMenuContent: func.isRequired,
  menuClassName: string,
  popoverTrigger: oneOf(['click', 'hover', 'focus']),
};

ResponsiveNavigation.defaultProps = {
  mobileBreakPoint: 575,
  throttleViewportChange: 250,
  placement: 'bottom',
  closeOnClick: true,
  popoverTrigger: 'click',
};

export default ResponsiveNavigation;
