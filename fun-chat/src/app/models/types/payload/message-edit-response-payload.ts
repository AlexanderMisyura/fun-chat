export type MessageEditResponsePayload = {
  message: {
    id: string;
    text: string;
    status: {
      isEdited: boolean;
    };
  };
};
