import type { ErrorMessage } from './message/error-message';
import type { FetchMessageHistoryMessage } from './message/fetch-message-history-message';
import type { FetchMessageHistoryResponseMessage } from './message/fetch-message-history-response-message';
import type { MessageDeleteMessage } from './message/message-delete-message';
import type { MessageDeleteResponseMessage } from './message/message-delete-response-message';
import type { MessageDeliverResponseMessage } from './message/message-deliver-response-message';
import type { MessageEditMessage } from './message/message-edit-message';
import type { MessageEditResponseMessage } from './message/message-edit-response-message';
import type { MessageReadMessage } from './message/message-read-message';
import type { MessageReadResponseMessage } from './message/message-read-response-message';
import type { MessageSendMessage } from './message/message-send-message';
import type { MessageSendReceiveResponseMessage } from './message/message-send-receive-response-message';
import type { UserActiveMessage } from './message/user-active-message';
import type { UserActiveResponseMessage } from './message/user-active-response-message';
import type { UserExternalLoginResponseMessage } from './message/user-external-login-response-message';
import type { UserExternalLogoutResponseMessage } from './message/user-external-logout-response-message';
import type { UserInactiveMessage } from './message/user-inactive-message';
import type { UserInactiveResponseMessage } from './message/user-inactive-response-message';
import type { UserLoginMessage } from './message/user-login-message';
import type { UserLoginResponseMessage } from './message/user-login-response-message';
import type { UserLogoutMessage } from './message/user-logout-message';
import type { UserLogoutResponseMessage } from './message/user-logout-response-message';

export type WebSocketMessageUnion =
  | ErrorMessage
  | FetchMessageHistoryMessage
  | FetchMessageHistoryResponseMessage
  | MessageDeleteMessage
  | MessageDeleteResponseMessage
  | MessageDeliverResponseMessage
  | MessageEditMessage
  | MessageEditResponseMessage
  | MessageReadMessage
  | MessageReadResponseMessage
  | MessageSendMessage
  | MessageSendReceiveResponseMessage
  | UserActiveMessage
  | UserActiveResponseMessage
  | UserInactiveMessage
  | UserInactiveResponseMessage
  | UserLoginMessage
  | UserLoginResponseMessage
  | UserLogoutMessage
  | UserLogoutResponseMessage
  | UserExternalLogoutResponseMessage
  | UserExternalLoginResponseMessage;

export type WebSocketResponseMessageUnion =
  | FetchMessageHistoryResponseMessage
  | MessageDeleteResponseMessage
  | MessageDeliverResponseMessage
  | MessageEditResponseMessage
  | MessageReadResponseMessage
  | MessageSendReceiveResponseMessage
  | UserActiveResponseMessage
  | UserInactiveResponseMessage
  | UserLoginResponseMessage
  | UserLogoutResponseMessage
  | ErrorMessage
  | UserExternalLogoutResponseMessage
  | UserExternalLoginResponseMessage;
