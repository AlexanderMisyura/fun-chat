import machine from '@state-machine/machine';
import type { RouteObject } from '@ts-types';

function getCurrentHref(): string {
  return globalThis.location.href;
}

function getCurrentPathname(): string {
  return globalThis.location.pathname;
}

export default class Router {
  public boundHandleLink: (href: string) => void;

  constructor(private routeObjects: RouteObject[]) {
    this.boundHandleLink = this.handleLink.bind(this);

    globalThis.addEventListener('popstate', () => this.initialLoad());
  }

  public initialLoad(): void {
    const currentPathname = getCurrentPathname();
    this.load(currentPathname);
  }

  public navigate(href: string): void {
    const url = new URL(href, globalThis.location.origin);
    globalThis.history.pushState({}, '', url);

    const pathname = url.pathname;

    this.load(pathname);
  }

  private load(pathname: string): void {
    const currentRouteObject = this.getCurrentRouteObj(pathname);

    if (currentRouteObject) {
      currentRouteObject.callback();
    } else {
      void machine.makeTransition(machine.value, 'navigateError', { currentRoute: pathname });
    }
  }

  private getCurrentRouteObj(pathname: string): RouteObject | undefined {
    return this.routeObjects.find((route) => route.pathname === pathname);
  }

  private handleLink = (href: string): void => {
    const currentHref = getCurrentHref();

    if (currentHref !== href) {
      this.navigate(href);
    }
  };
}
