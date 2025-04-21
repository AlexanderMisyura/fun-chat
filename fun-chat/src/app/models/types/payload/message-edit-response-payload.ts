export type MessageEditResponsePayload = {
  message: {
    id: string | null;
    text: string;
    status: {
      isEdited: boolean;
    };
  };
};
