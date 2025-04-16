export type MessageDeleteResponsePayload = {
  message: {
    id: string;
    status: {
      isDeleted: boolean;
    };
  };
};
