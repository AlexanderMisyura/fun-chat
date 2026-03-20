export type WebSocketMessage<MessageType, PayloadType> = {
  id: string | null;
  type: MessageType;
  payload: PayloadType;
};
