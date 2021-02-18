/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect, useRef} from 'react';
import {useLocation} from '@docusaurus/router';
import {useThemeConfig, domUtils} from '@docusaurus/theme-common';
import useScrollPosition from '@theme/hooks/useScrollPosition';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type {useHideableNavbarReturns} from '@theme/hooks/useHideableNavbar';

const useHideableNavbar = (): useHideableNavbarReturns => {
  const {hideOnScroll} = useThemeConfig().navbar;
  const location = useLocation();
  const isFocusedAnchor = useRef(false);
  const [navbarVisible, setNavbarVisible] = useState(hideOnScroll);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const navbarHeight =
    (ExecutionEnvironment.canUseDOM &&
      domUtils.convertRemToPx(
        domUtils.getPropertyValue('--ifm-navbar-height'),
      )) ||
    0;

  useScrollPosition(
    ({scrollY: scrollTop}) => {
      if (!hideOnScroll) {
        return;
      }

      if (scrollTop < navbarHeight) {
        return;
      }

      if (isFocusedAnchor.current) {
        isFocusedAnchor.current = false;
        setNavbarVisible(false);
        setLastScrollTop(scrollTop);
        return;
      }

      if (lastScrollTop && scrollTop === 0) {
        setNavbarVisible(true);
      }

      const documentHeight =
        document.documentElement.scrollHeight - navbarHeight;
      const windowHeight = window.innerHeight;

      if (lastScrollTop && scrollTop >= lastScrollTop) {
        setNavbarVisible(false);
      } else if (scrollTop + windowHeight < documentHeight) {
        setNavbarVisible(true);
      }

      setLastScrollTop(scrollTop);
    },
    [lastScrollTop, navbarHeight, isFocusedAnchor],
  );

  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    if (!lastScrollTop) {
      return;
    }

    setNavbarVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!hideOnScroll) {
      return;
    }

    if (!location.hash) {
      return;
    }

    isFocusedAnchor.current = true;
  }, [location.hash]);

  return {
    navbarVisible,
    setNavbarVisible,
  };
};

export default useHideableNavbar;
