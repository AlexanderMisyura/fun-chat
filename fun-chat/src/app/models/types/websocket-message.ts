export type WebSocketMessage<PayloadType = unknown> = {
  id: string | null;
  type: string;
  payload: PayloadType;
};
