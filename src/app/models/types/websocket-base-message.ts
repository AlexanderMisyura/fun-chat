export type WebSocketBaseMessage = {
  id: string | null;
  type: string;
  payload: unknown;
};
