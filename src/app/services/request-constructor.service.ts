import {
  FETCH_MESSAGE_HISTORY,
  MESSAGE_DELETE,
  MESSAGE_EDIT,
  MESSAGE_READ,
  MESSAGE_SEND,
  NULL,
  USER_ACTIVE,
  USER_INACTIVE,
  USER_LOGIN,
  USER_LOGOUT,
} from '@constants';
import { WebSocketEvent } from '@ts-enums';
import type {
  FetchMessageHistoryMessage,
  MessageDeleteMessage,
  MessageEditMessage,
  MessageReadMessage,
  MessageSendMessage,
  UserActiveMessage,
  UserInactiveMessage,
  UserLoginMessage,
  UserLogoutMessage,
} from '@ts-types';

import WebSocketService from './websocket.service';

export default class RequestCreator {
  private static _instance: RequestCreator | undefined;
  private id: string = this.regenerateId();
  private constructor() {
    WebSocketService.instance.onEvent(WebSocketEvent.OPEN, () => this.regenerateId());
  }
  public static get instance(): RequestCreator {
    if (!this._instance) this._instance = new RequestCreator();
    return this._instance;
  }

  public createEditMessageMessage(message: { id: string; text: string }): MessageEditMessage {
    return {
      id: this.id,
      type: MESSAGE_EDIT,
      payload: { message },
    };
  }

  public createReadMessageMessage(id: string): MessageReadMessage {
    return {
      id: this.id,
      type: MESSAGE_READ,
      payload: {
        message: {
          id,
        },
      },
    };
  }

  public createDeleteMessageMessage(id: string): MessageDeleteMessage {
    return {
      id: this.id,
      type: MESSAGE_DELETE,
      payload: {
        message: {
          id,
        },
      },
    };
  }

  public createSendMessageMessage(message: { to: string; text: string }): MessageSendMessage {
    return {
      id: this.id,
      type: MESSAGE_SEND,
      payload: { message },
    };
  }

  public createGetInactiveUsersMessage(): UserInactiveMessage {
    return {
      id: this.id,
      type: USER_INACTIVE,
      payload: NULL,
    };
  }

  public createGetActiveUsersMessage(): UserActiveMessage {
    return {
      id: this.id,
      type: USER_ACTIVE,
      payload: NULL,
    };
  }

  public createFetchMessageHistoryMessage(username: string): FetchMessageHistoryMessage {
    return {
      id: username,
      type: FETCH_MESSAGE_HISTORY,
      payload: {
        user: {
          login: username,
        },
      },
    };
  }

  public createLoginMessage(loginUser: { username: string; password: string }): UserLoginMessage {
    return {
      id: this.id,
      type: USER_LOGIN,
      payload: {
        user: {
          login: loginUser.username,
          password: loginUser.password,
        },
      },
    };
  }

  public createLogoutMessage(logoutUser: {
    username: string;
    password: string;
  }): UserLogoutMessage {
    return {
      id: this.id,
      type: USER_LOGOUT,
      payload: {
        user: {
          login: logoutUser.username,
          password: logoutUser.password,
        },
      },
    };
  }

  private regenerateId(): string {
    this.id = crypto.randomUUID();
    return this.id;
  }
}
