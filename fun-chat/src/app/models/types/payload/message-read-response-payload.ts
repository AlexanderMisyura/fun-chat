export type MessageReadResponsePayload = {
  message: {
    id: string;
    status: {
      isReaded: boolean;
    };
  };
};
