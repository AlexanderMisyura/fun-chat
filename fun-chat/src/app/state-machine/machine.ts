import { Route } from '@constants';
import { State, Transition } from '@ts-enums';
import type { MachineDefinition } from '@ts-types';

import { StateMachine } from './machine-class';

const stateMachineDefinition: MachineDefinition = {
  initialState: State.INITIAL,

  context: {
    currentRoute: Route.ROOT,
  },

  states: {
    [State.INITIAL]: {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        [Transition.NAVIGATE_LOGIN]: {
          target: State.LOGIN,
          action(payload) {
            payload.updateContext({ currentRoute: Route.LOGIN });
          },
        },
        [Transition.NAVIGATE_CHAT]: {
          target: State.CHAT,
          action(payload) {
            payload.updateContext({ currentRoute: Route.CHAT });
          },
        },
        [Transition.NAVIGATE_ABOUT]: {
          target: State.ABOUT,
          action(payload) {
            payload.updateContext({ currentRoute: Route.ABOUT });
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
            payload.updateContext({ currentRoute: Route.CHAT });
          },
        },
        [Transition.NAVIGATE_ABOUT]: {
          target: State.ABOUT,
          action(payload) {
            payload.updateContext({ currentRoute: Route.ABOUT });
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
            payload.updateContext({ currentRoute: Route.LOGIN });
          },
        },
        [Transition.NAVIGATE_ABOUT]: {
          target: State.ABOUT,
          action(payload) {
            payload.updateContext({ currentRoute: Route.ABOUT });
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
            payload.updateContext({ currentRoute: Route.LOGIN });
          },
        },
        [Transition.NAVIGATE_CHAT]: {
          target: State.CHAT,
          action(payload) {
            payload.updateContext({ currentRoute: Route.CHAT });
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
            payload.updateContext({ currentRoute: Route.LOGIN });
          },
        },
        [Transition.NAVIGATE_CHAT]: {
          target: State.CHAT,
          action(payload) {
            payload.updateContext({ currentRoute: Route.CHAT });
          },
        },
        [Transition.NAVIGATE_ABOUT]: {
          target: State.ABOUT,
          action(payload) {
            payload.updateContext({ currentRoute: Route.ABOUT });
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
