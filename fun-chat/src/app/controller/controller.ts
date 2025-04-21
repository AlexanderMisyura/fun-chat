import config from '@config';
import {
  ERROR,
  ROUTE,
  STORAGE_KEY,
  STORED_USER_DEFAULT,
  USER_LOGIN,
  USER_LOGOUT,
} from '@constants';
import RequestConstructor from '@services/request-constructor.service';
import SessionStorageService from '@services/session-storage.service';
import ValidatorService from '@services/validator.service';
import WebSocketService from '@services/websocket.service';
import machine from '@state-machine/machine';
import type {
  StoredUser,
  UserLoginResponseMessage,
  UserLogoutResponseMessage,
  UserStorageData,
  WebSocketResponseMessageUnion,
} from '@ts-types';
import { parseJSONData } from '@utils/parse-json-data';

import Router from '../router';

const socket = WebSocketService.instance;
const request = RequestConstructor.instance;
const router = Router.instance;

export default class Controller {
  private static _instance: Controller | undefined;
  private readonly storageService: SessionStorageService<UserStorageData> =
    new SessionStorageService<UserStorageData>(config.STORAGE_PREFIX);

  private constructor() {
    this.addListeners();
  }

  public static get instance(): Controller {
    if (!Controller._instance) {
      Controller._instance = new Controller();
    }

    return Controller._instance;
  }

  public init(): void {}

  public getUserFromStorage(): StoredUser | undefined {
    return this.storageService.getData(
      STORAGE_KEY.USER,
      parseJSONData,
      STORED_USER_DEFAULT,
      ValidatorService.instance.isStoredUser.bind(ValidatorService.instance)
    );
  }

  public checkUserLoggedIn(): boolean {
    const user = this.getUserFromStorage();
    return user?.isLoggedIn || false;
  }

  public makeRequestLoginUser(loginUser: { username: string; password: string }): void {
    const message = request.createLoginMessage(loginUser);

    if (!message.id) throw new Error('Id is not defined');

    socket.send(JSON.stringify(message));

    machine.updateContext({
      username: loginUser.username,
      password: loginUser.password,
      id: message.id,
      isLoggedIn: false,
    });

    this.storageService.saveData(STORAGE_KEY.USER, {
      username: loginUser.username,
      password: loginUser.password,
      id: message.id,
      isLoggedIn: false,
    });
  }

  public makeRequestLogoutUser(): void {
    const message = request.createLogoutMessage({
      username: machine.context.username,
      password: machine.context.password,
    });

    socket.send(JSON.stringify(message));
  }

  public makeRequestFetchMessageHistory(username: string): void {
    const message = request.createFetchMessageHistoryMessage(username);

    socket.send(JSON.stringify(message));
  }

  public makeRequestGetActiveUsers(): void {
    const message = request.createGetActiveUsersMessage();

    socket.send(JSON.stringify(message));
  }

  public makeRequestGetInactiveUsers(): void {
    const message = request.createGetInactiveUsersMessage();

    socket.send(JSON.stringify(message));
  }

  public makeRequestSendMessage(message: { to: string; text: string }): void {
    const sendMessage = request.createSendMessageMessage(message);

    socket.send(JSON.stringify(sendMessage));
  }

  public makeRequestDeleteMessage(id: string): void {
    const deleteMessage = request.createDeleteMessageMessage(id);

    socket.send(JSON.stringify(deleteMessage));
  }

  public makeRequestReadMessage(id: string): void {
    const readMessage = request.createReadMessageMessage(id);

    socket.send(JSON.stringify(readMessage));
  }

  public makeRequestEditMessage(message: { id: string; text: string }): void {
    const editMessage = request.createEditMessageMessage(message);

    socket.send(JSON.stringify(editMessage));
  }

  private handleConnectionOpen(): void {
    const user = this.getUserFromStorage();

    if (user?.isLoggedIn) {
      this.makeRequestLoginUser({ username: user.username, password: user.password });
    }
  }

  private handleSocketMessage(message: WebSocketResponseMessageUnion): void {
    if (message.type === USER_LOGIN) {
      this.handleUserLoginResponseMessage(message);
    }

    if (message.type === USER_LOGOUT) {
      this.handleUserLogoutResponseMessage(message);
    }

    if (message.type === ERROR && message.payload.error === 'incorrect password') {
      this.storageService.saveData(STORAGE_KEY.USER, STORED_USER_DEFAULT);
    }
  }

  private handleUserLogoutResponseMessage(message: UserLogoutResponseMessage): void {
    if (!message.payload.user.isLogined) {
      this.storageService.saveData(STORAGE_KEY.USER, STORED_USER_DEFAULT);

      machine.updateContext({ isLoggedIn: false });
      router.navigate(ROUTE.LOGIN);
    }
  }

  private handleUserLoginResponseMessage(message: UserLoginResponseMessage): void {
    if (message.payload.user.isLogined) {
      this.storageService.saveData(STORAGE_KEY.USER, {
        username: machine.context.username,
        password: machine.context.password,
        id: machine.context.id,
        isLoggedIn: true,
      });

      machine.updateContext({ isLoggedIn: true });
      if (machine.context.currentRoute === ROUTE.LOGIN) router.navigate(ROUTE.CHAT);
    }
  }

  private addListeners(): void {
    socket.onEvent(socket.eventsMapEvent.open, () => this.handleConnectionOpen());

    socket.onMessage(
      socket.eventsMapParsedMessage.PARSED_MESSAGE,
      (message: WebSocketResponseMessageUnion) => this.handleSocketMessage(message)
    );
  }
}
