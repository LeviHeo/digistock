'use client';
import { useEffect, useContext } from 'react';
import { ConfigContext } from '@/context/config.context';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

// ! Align tailwind.config screen list
export enum ScreenList {
  xxs = 'xxs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  hd = 'hd',
  xxl = 'xxl',
}

export enum MatchMediaType {
  maxWidth = 'max-width',
  minWidth = 'min-width',
  only = 'only',
}

const findKeyByValue = (object: any, value: string) => Object.keys(object).find((key) => object[key] === value);

const fullConfig = resolveConfig(tailwindConfig);
const { screens } = fullConfig.theme as any;

const bpSizes = Object.keys(screens)
  .map((screenSize) => parseInt(screens[screenSize]))
  .sort(function (a, b) {
    return a - b;
  });

const bpShapes = bpSizes.map((size, index) => ({
  min: !index ? 0 : bpSizes[index - 1],
  max: size,
  key: findKeyByValue(screens, `${size}px`),
}));

bpSizes.map((size, index) => {
  const isLastBp = index === bpSizes.length - 1;
  if (isLastBp) {
    const res = {
      min: size,
      max: 100000,
      key: 'max',
    };
    bpShapes.push(res);
  }
});

const getDeviceConfig = (width: number) => {
  let breakpoint = null;

  bpShapes.forEach((shape, index) => {
    if (!shape.min && width < shape.max) {
      breakpoint = shape.key;
    } else if (width >= shape.min && width < shape.max) {
      breakpoint = shape.key;
    } else if (!shape.max && width >= shape.max) {
      breakpoint = shape.key;
    }
  });

  return breakpoint;
};

export const SetBreakPoint = () => {
  const { setScreen } = useContext(ConfigContext);

  useEffect(() => {
    const calcInnerWidth = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      const newScreen = getDeviceConfig(width);
      setScreen(newScreen);
    };

    calcInnerWidth();
    window.addEventListener('resize', calcInnerWidth);
  });
};

export const MatchMedia = (bp: ScreenList, minMax = MatchMediaType.maxWidth as string) => {
  const { screen } = useContext(ConfigContext);
  let order: number;
  let isShowRange: any = [];

  bpShapes.forEach((item, index) => {
    if (item.key === bp) order = index;
  });

  if (minMax === MatchMediaType.maxWidth) {
    bpShapes.forEach((item, index) => {
      if (index <= order) isShowRange.push(item.key);
    });

    return isShowRange.includes(screen);
  }

  if (minMax === MatchMediaType.minWidth) {
    bpShapes.forEach((item, index) => {
      if (index > order) isShowRange.push(item.key);
    });

    return isShowRange.includes(screen);
  }

  if (minMax === MatchMediaType.only) {
    return screen === bp;
  }
};
