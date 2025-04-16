import type { Route } from '@constants';

export type RouteObject = {
  pathname: (typeof Route)[keyof typeof Route];
  callback: () => void;
};
