import './styles/global.scss';

import Main from '@components/main/main';
import { ROUTE } from '@constants';
import Controller from '@controller/controller';
import machine from '@state-machine/machine';
import { Transition } from '@ts-enums';
import type { RouteObject } from '@ts-types';

import Router from './router';

const controller = Controller.instance;
const router = Router.instance;

controller.init();

export default class App {
  private static _instance: App | undefined;
  private main: Main;

  private constructor() {
    router.setRouteObjects(this.createRouteObjects());
    this.main = new Main(router.boundHandleLink);
  }

  public static get instance(): App {
    if (!App._instance) {
      App._instance = new App();
    }

    return App._instance;
  }

  public init(): void {
    router.initialLoad();
    this.main.mount();
  }

  private createRouteObjects(): RouteObject[] {
    return [
      {
        pathname: ROUTE.ROOT,
        callback: (): void => router.navigate(ROUTE.LOGIN),
      },
      {
        pathname: ROUTE.LOGIN,
        callback: (): void => this.navigateLogin(),
      },
      {
        pathname: ROUTE.CHAT,
        callback: (): void => this.navigateChat(),
      },
      {
        pathname: ROUTE.ABOUT,
        callback: (): void => this.navigateAbout(),
      },
    ];
  }

  private navigateLogin(): void {
    if (machine.context.isLoggedIn) {
      router.navigate(ROUTE.CHAT);
      return;
    }

    void machine.makeTransition(machine.value, Transition.NAVIGATE_LOGIN);
  }

  private navigateChat(): void {
    if (!machine.context.isLoggedIn) {
      router.navigate(ROUTE.LOGIN);
      return;
    }

    void machine.makeTransition(machine.value, Transition.NAVIGATE_CHAT);
  }

  private navigateAbout(): void {
    void machine.makeTransition(machine.value, Transition.NAVIGATE_ABOUT);
  }
}
