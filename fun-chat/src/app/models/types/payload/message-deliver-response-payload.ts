export type MessageDeliverResponsePayload = {
  message: {
    id: string;
    status: {
      isDelivered: boolean;
    };
  };
};
