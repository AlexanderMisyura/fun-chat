export type MessageDeliverResponsePayload = {
  message: {
    id: string | null;
    status: {
      isDelivered: boolean;
    };
  };
};
