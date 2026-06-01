import api from "./api";

export const orderService = {
  async getOrders() {
    const { data } = await api.get("/orders");
    return data;
  },

  async getOrdersByUser(userId) {
    const { data } = await api.get("/orders", {
      params: { userId },
    });
    return data;
  },

  async createOrder(payload) {
    const { data } = await api.post("/orders", payload);
    return data;
  },

  async updateOrder(id, payload) {
    const { data } = await api.patch(`/orders/${id}`, payload);
    return data;
  },

  async deleteOrder(id) {
    await api.delete(`/orders/${id}`);
    return id;
  },
};

export default orderService;
