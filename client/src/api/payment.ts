import API from "./axios";

export const initializePayment = (groupId: string) =>
    API.post(`/payments/initialize/${groupId}`)