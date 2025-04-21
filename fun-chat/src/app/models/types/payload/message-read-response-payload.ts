export type MessageReadResponsePayload = {
  message: {
    id: string | null;
    status: {
      isReaded: boolean;
    };
  };
};
