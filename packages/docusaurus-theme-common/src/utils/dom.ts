/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function getPropertyValue(name: string): string {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name);
}

function convertRemToPx(rem: number | string): number {
  return (
    parseFloat(getPropertyValue('font-size')) *
    (typeof rem === 'string' ? parseFloat(rem) : rem)
  );
}

function isInViewport(element: HTMLElement) {
  const {top, left, bottom, right} = element.getBoundingClientRect();
  const {innerHeight, innerWidth} = window;

  return top >= 0 && right <= innerWidth && bottom <= innerHeight && left >= 0;
}

export const domUtils = new Proxy(
  {getPropertyValue, convertRemToPx, isInViewport},
  {
    get: (obj: any, prop: any) => {
      const origMethod = obj[prop];

      return (...args: any) => {
        if (!ExecutionEnvironment.canUseDOM) {
          return undefined;
        }

        return origMethod.apply(obj, args);
      };
    },
  },
);
