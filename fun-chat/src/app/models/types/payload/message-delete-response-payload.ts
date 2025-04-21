export type MessageDeleteResponsePayload = {
  message: {
    id: string | null;
    status: {
      isDeleted: boolean;
    };
  };
};
