import type { ROUTE } from '@constants';

export type RouteObject = {
  pathname: (typeof ROUTE)[keyof typeof ROUTE];
  callback: () => void;
};
