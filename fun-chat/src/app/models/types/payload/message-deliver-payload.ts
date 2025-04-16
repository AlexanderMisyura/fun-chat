export type MessageDeliverPayload = {
  message: {
    id: string;
    status: {
      isDelivered: boolean;
    };
  };
};
