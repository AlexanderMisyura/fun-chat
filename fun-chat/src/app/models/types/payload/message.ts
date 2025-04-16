import type { MessageStatus } from '@ts-types';

export type Message = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
};
