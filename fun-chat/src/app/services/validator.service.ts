import {
  ERROR,
  FETCH_MESSAGE_HISTORY,
  MESSAGE_DELETE,
  MESSAGE_DELIVER,
  MESSAGE_EDIT,
  MESSAGE_READ,
  MESSAGE_SEND,
  USER_ACTIVE,
  USER_EXTERNAL_LOGIN,
  USER_EXTERNAL_LOGOUT,
  USER_INACTIVE,
  USER_LOGIN,
  USER_LOGOUT,
} from '@constants';
import type {
  ErrorMessage,
  ErrorPayload,
  FetchMessageHistoryResponseMessage,
  Message,
  MessageArrayResponsePayload,
  MessageDeleteResponseMessage,
  MessageDeleteResponsePayload,
  MessageDeliverResponseMessage,
  MessageDeliverResponsePayload,
  MessageEditResponseMessage,
  MessageEditResponsePayload,
  MessageReadResponseMessage,
  MessageReadResponsePayload,
  MessageResponsePayload,
  MessageSendReceiveResponseMessage,
  MessageStatus,
  StoredUser,
  User,
  UserActiveResponseMessage,
  UserExternalLoginResponseMessage,
  UserExternalLogoutResponseMessage,
  UserInactiveResponseMessage,
  UserLoginResponseMessage,
  UserLogoutResponseMessage,
  UserPayload,
  WebSocketBaseMessage,
  WebSocketResponseMessageUnion,
} from '@ts-types';

export default class Validator {
  private static _instance: Validator | undefined;

  private messageValidatorsMap: {
    [TypeName in WebSocketResponseMessageUnion['type']]: (
      message: unknown
    ) => message is Extract<WebSocketResponseMessageUnion, { type: TypeName }>;
  } = {
    [FETCH_MESSAGE_HISTORY]: this.isFetchMessageHistoryResponseMessage.bind(this),
    [MESSAGE_DELETE]: this.isMessageDeleteResponseMessage.bind(this),
    [MESSAGE_DELIVER]: this.isMessageDeliverResponseMessage.bind(this),
    [MESSAGE_EDIT]: this.isMessageEditResponseMessage.bind(this),
    [MESSAGE_READ]: this.isMessageReadResponseMessage.bind(this),
    [MESSAGE_SEND]: this.isMessageSendResponseMessage.bind(this),
    [USER_ACTIVE]: this.isUserActiveResponseMessage.bind(this),
    [USER_EXTERNAL_LOGIN]: this.isUserExternalLoginMessage.bind(this),
    [USER_EXTERNAL_LOGOUT]: this.isUserExternalLogoutResponseMessage.bind(this),
    [USER_INACTIVE]: this.isUserInactiveResponseMessage.bind(this),
    [USER_LOGIN]: this.isUserLoginResponseMessage.bind(this),
    [USER_LOGOUT]: this.isUserLogoutResponseMessage.bind(this),
    [ERROR]: this.isErrorMessage.bind(this),
  };

  private constructor() {}

  public static get instance(): Validator {
    if (!Validator._instance) {
      Validator._instance = new Validator();
    }

    return Validator._instance;
  }

  public isStoredUser(storedUser: unknown): storedUser is StoredUser {
    return (
      this.isObject(storedUser) &&
      'username' in storedUser &&
      typeof storedUser.username === 'string' &&
      'id' in storedUser &&
      typeof storedUser.id === 'string' &&
      'isLoggedIn' in storedUser &&
      typeof storedUser.isLoggedIn === 'boolean'
    );
  }

  public getValidatedWebSocketResponseMessageUnion(
    message: unknown
  ): WebSocketResponseMessageUnion | undefined {
    if (!this.isWebSocketBaseMessage(message)) return undefined;

    for (const [typeName, validator] of Object.entries(this.messageValidatorsMap)) {
      if (message.type === typeName && validator(message)) {
        return message;
      }
    }

    return undefined;
  }

  public isWebSocketBaseMessage(message: unknown): message is WebSocketBaseMessage {
    return (
      this.isObject(message) &&
      'id' in message &&
      (typeof message.id === 'string' || message.id === null) &&
      'type' in message &&
      typeof message.type === 'string' &&
      'payload' in message
    );
  }

  public isErrorMessage(message: unknown): message is ErrorMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== ERROR) return false;

    return this.isErrorPayload(message.payload);
  }

  public isUserLoginResponseMessage(message: unknown): message is UserLoginResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== USER_LOGIN) return false;

    return this.isUserPayload(message.payload);
  }

  public isUserLogoutResponseMessage(message: unknown): message is UserLogoutResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== USER_LOGOUT) return false;

    return this.isUserPayload(message.payload);
  }

  public isUserExternalLoginMessage(message: unknown): message is UserExternalLoginResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== USER_EXTERNAL_LOGIN) return false;

    return this.isUserPayload(message.payload);
  }

  public isUserExternalLogoutResponseMessage(
    message: unknown
  ): message is UserExternalLogoutResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== USER_EXTERNAL_LOGOUT) return false;

    return this.isUserPayload(message.payload);
  }

  public isUserActiveResponseMessage(message: unknown): message is UserActiveResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== USER_ACTIVE) return false;

    return this.isUserArrayPayload(message.payload);
  }

  public isUserInactiveResponseMessage(message: unknown): message is UserInactiveResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== USER_INACTIVE) return false;

    return this.isUserArrayPayload(message.payload);
  }

  public isMessageSendResponseMessage(
    message: unknown
  ): message is MessageSendReceiveResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== MESSAGE_SEND) return false;

    return this.isMessageResponsePayload(message.payload);
  }

  public isFetchMessageHistoryResponseMessage(
    message: unknown
  ): message is FetchMessageHistoryResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== FETCH_MESSAGE_HISTORY) return false;

    return this.isMessageArrayResponsePayload(message.payload);
  }

  public isMessageDeliverResponseMessage(
    message: unknown
  ): message is MessageDeliverResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== MESSAGE_DELIVER) return false;

    return this.isMessageDeliverResponsePayload(message.payload);
  }

  public isMessageReadResponseMessage(message: unknown): message is MessageReadResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== MESSAGE_READ) return false;

    return this.isMessageReadResponsePayload(message.payload);
  }

  public isMessageDeleteResponseMessage(message: unknown): message is MessageDeleteResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== MESSAGE_DELETE) return false;

    return this.isMessageDeleteResponsePayload(message.payload);
  }

  public isMessageEditResponseMessage(message: unknown): message is MessageEditResponseMessage {
    if (!this.isWebSocketBaseMessage(message)) return false;
    if (message.type !== MESSAGE_EDIT) return false;

    return this.isMessageEditResponsePayload(message.payload);
  }

  private isMessageEditResponsePayload(payload: unknown): payload is MessageEditResponsePayload {
    return (
      this.isObjectHoldsMessage(payload) &&
      this.isObject(payload.message) &&
      'id' in payload.message &&
      typeof payload.message.id === 'string' &&
      'text' in payload.message &&
      typeof payload.message.text === 'string' &&
      'status' in payload.message &&
      this.isObject(payload.message.status) &&
      'isEdited' in payload.message.status &&
      typeof payload.message.status.isEdited === 'boolean'
    );
  }

  private isMessageDeleteResponsePayload(
    payload: unknown
  ): payload is MessageDeleteResponsePayload {
    return (
      this.isObjectHoldsMessage(payload) &&
      this.isObject(payload.message) &&
      'id' in payload.message &&
      typeof payload.message.id === 'string' &&
      'status' in payload.message &&
      this.isObject(payload.message.status) &&
      'isDeleted' in payload.message.status &&
      typeof payload.message.status.isDeleted === 'boolean'
    );
  }

  private isMessageReadResponsePayload(payload: unknown): payload is MessageReadResponsePayload {
    return (
      this.isObjectHoldsMessage(payload) &&
      this.isObject(payload.message) &&
      'id' in payload.message &&
      typeof payload.message.id === 'string' &&
      'status' in payload.message &&
      this.isObject(payload.message.status) &&
      'isRead' in payload.message.status &&
      typeof payload.message.status.isRead === 'boolean'
    );
  }

  private isMessageDeliverResponsePayload(
    payload: unknown
  ): payload is MessageDeliverResponsePayload {
    return (
      this.isObjectHoldsMessage(payload) &&
      this.isObject(payload.message) &&
      'id' in payload.message &&
      typeof payload.message.id === 'string' &&
      'status' in payload.message &&
      this.isObject(payload.message.status) &&
      'isDelivered' in payload.message.status &&
      typeof payload.message.status.isDelivered === 'boolean'
    );
  }

  private isMessageArrayResponsePayload(payload: unknown): payload is MessageArrayResponsePayload {
    return (
      this.isObject(payload) &&
      'messages' in payload &&
      Array.isArray(payload.messages) &&
      payload.messages.every((message) => this.isMessage(message))
    );
  }

  private isMessageResponsePayload(payload: unknown): payload is MessageResponsePayload {
    return (
      this.isObjectHoldsMessage(payload) &&
      this.isObject(payload.message) &&
      this.isMessage(payload.message)
    );
  }

  private isObjectHoldsMessage(object: unknown): object is { message: unknown } {
    return this.isObject(object) && 'message' in object;
  }

  private isMessage(message: unknown): message is Message {
    return (
      this.isObject(message) &&
      'id' in message &&
      typeof message.id === 'string' &&
      'from' in message &&
      typeof message.from === 'string' &&
      'to' in message &&
      typeof message.to === 'string' &&
      'text' in message &&
      typeof message.text === 'string' &&
      'datetime' in message &&
      typeof message.datetime === 'number' &&
      'status' in message &&
      this.isMessageStatus(message.status)
    );
  }

  private isMessageStatus(status: unknown): status is Omit<MessageStatus, 'isDeleted'> {
    return (
      this.isObject(status) &&
      'isDelivered' in status &&
      typeof status.isDelivered === 'boolean' &&
      'isReaded' in status &&
      typeof status.isReaded === 'boolean' &&
      'isEdited' in status &&
      typeof status.isEdited === 'boolean'
    );
  }

  private isUserArrayPayload(usersPayload: unknown): usersPayload is User[] {
    return (
      this.isObject(usersPayload) &&
      'users' in usersPayload &&
      Array.isArray(usersPayload.users) &&
      usersPayload.users.every((user) => this.isUser(user))
    );
  }

  private isUserPayload(userPayload: unknown): userPayload is UserPayload {
    return (
      this.isObject(userPayload) &&
      'user' in userPayload &&
      this.isObject(userPayload.user) &&
      this.isUser(userPayload.user)
    );
  }

  private isErrorPayload(errorPayload: unknown): errorPayload is ErrorPayload {
    return (
      this.isObject(errorPayload) &&
      'error' in errorPayload &&
      typeof errorPayload.error === 'string'
    );
  }

  private isUser(user: unknown): user is User {
    return (
      this.isObject(user) &&
      'login' in user &&
      typeof user.login === 'string' &&
      'isLogined' in user &&
      typeof user.isLogined === 'boolean'
    );
  }

  private isObject(object: unknown): object is Record<string, unknown> {
    return typeof object === 'object' && object !== null;
  }
}
