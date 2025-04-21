import { PRELOAD_MESSAGE, ROUTE } from '@constants';
import NotificationService from '@services/notification.service';
import WebSocketService from '@services/websocket.service';
import { State, Transition } from '@ts-enums';
import type { MachineDefinition } from '@ts-types';

import { StateMachine } from './machine-class';

const stateMachineDefinition: MachineDefinition = {
  initialState: State.INITIAL,

  context: {
    currentRoute: ROUTE.ROOT,
    id: '',
    username: '',
    password: '',
    isLoggedIn: false,
  },

  states: {
    [State.INITIAL]: {
      actions: {
        onEnter() {},
        onExit() {
          NotificationService.instance.showPreloader(PRELOAD_MESSAGE.LOADING);
          WebSocketService.instance.openConnection();
        },
      },
      transitions: {
        [Transition.NAVIGATE_LOGIN]: {
          target: State.LOGIN,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.LOGIN });
          },
        },
        [Transition.NAVIGATE_CHAT]: {
          target: State.CHAT,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.CHAT });
          },
        },
        [Transition.NAVIGATE_ABOUT]: {
          target: State.ABOUT,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.ABOUT });
          },
        },
        [Transition.NAVIGATE_ERROR]: {
          target: State.ERROR,
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
    [State.LOGIN]: {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        [Transition.NAVIGATE_CHAT]: {
          target: State.CHAT,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.CHAT });
          },
        },
        [Transition.NAVIGATE_ABOUT]: {
          target: State.ABOUT,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.ABOUT });
          },
        },
        [Transition.NAVIGATE_ERROR]: {
          target: State.ERROR,
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
    [State.CHAT]: {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        [Transition.NAVIGATE_LOGIN]: {
          target: State.LOGIN,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.LOGIN });
          },
        },
        [Transition.NAVIGATE_ABOUT]: {
          target: State.ABOUT,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.ABOUT });
          },
        },
        [Transition.NAVIGATE_ERROR]: {
          target: State.ERROR,
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
    [State.ABOUT]: {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        [Transition.NAVIGATE_LOGIN]: {
          target: State.LOGIN,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.LOGIN });
          },
        },
        [Transition.NAVIGATE_CHAT]: {
          target: State.CHAT,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.CHAT });
          },
        },
        [Transition.NAVIGATE_ERROR]: {
          target: State.ERROR,
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
    [State.ERROR]: {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        [Transition.NAVIGATE_LOGIN]: {
          target: State.LOGIN,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.LOGIN });
          },
        },
        [Transition.NAVIGATE_CHAT]: {
          target: State.CHAT,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.CHAT });
          },
        },
        [Transition.NAVIGATE_ABOUT]: {
          target: State.ABOUT,
          action(payload) {
            payload.updateContext({ currentRoute: ROUTE.ABOUT });
          },
        },
        [Transition.NAVIGATE_ERROR]: {
          target: State.ERROR,
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
  },
};

const machine = new StateMachine(stateMachineDefinition);

export default machine;
