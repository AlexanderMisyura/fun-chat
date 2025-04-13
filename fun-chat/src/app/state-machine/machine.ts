import type { MachineDefinition } from '@ts-types';

import { StateMachine } from './machine-class';

const stateMachineDefinition: MachineDefinition = {
  initialState: 'state:initial',

  context: {
    currentRoute: '/',
  },

  states: {
    'state:initial': {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        navigateLogin: {
          target: 'state:login',
          action(payload) {
            payload.updateContext({ currentRoute: '/login' });
          },
        },
        navigateChat: {
          target: 'state:chat',
          action(payload) {
            payload.updateContext({ currentRoute: '/chat' });
          },
        },
        navigateAbout: {
          target: 'state:about',
          action(payload) {
            payload.updateContext({ currentRoute: '/about' });
          },
        },
        navigateError: {
          target: 'state:404',
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
    'state:login': {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        navigateChat: {
          target: 'state:chat',
          action(payload) {
            payload.updateContext({ currentRoute: '/chat' });
          },
        },
        navigateAbout: {
          target: 'state:about',
          action(payload) {
            payload.updateContext({ currentRoute: '/about' });
          },
        },
        navigateError: {
          target: 'state:404',
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
    'state:chat': {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        navigateLogin: {
          target: 'state:login',
          action(payload) {
            payload.updateContext({ currentRoute: '/login' });
          },
        },
        navigateAbout: {
          target: 'state:about',
          action(payload) {
            payload.updateContext({ currentRoute: '/about' });
          },
        },
        navigateError: {
          target: 'state:404',
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
    'state:about': {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        navigateLogin: {
          target: 'state:login',
          action(payload) {
            payload.updateContext({ currentRoute: '/login' });
          },
        },
        navigateChat: {
          target: 'state:chat',
          action(payload) {
            payload.updateContext({ currentRoute: '/chat' });
          },
        },
        navigateError: {
          target: 'state:404',
          action(payload) {
            const { contextData } = payload;
            if (contextData?.currentRoute) {
              payload.updateContext({ currentRoute: contextData.currentRoute });
            }
          },
        },
      },
    },
    'state:404': {
      actions: {
        onEnter() {},
        onExit() {},
      },
      transitions: {
        navigateLogin: {
          target: 'state:login',
          action(payload) {
            payload.updateContext({ currentRoute: '/login' });
          },
        },
        navigateChat: {
          target: 'state:chat',
          action(payload) {
            payload.updateContext({ currentRoute: '/chat' });
          },
        },
        navigateAbout: {
          target: 'state:about',
          action(payload) {
            payload.updateContext({ currentRoute: '/about' });
          },
        },
        navigateError: {
          target: 'state:404',
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
