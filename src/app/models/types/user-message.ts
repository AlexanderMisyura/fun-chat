import type { Message, User } from '@ts-types';

export type UserMessage = {
  user: User;
  messages: Message[];
};
