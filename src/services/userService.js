import api from "./api";

export const userService = {
  async getUsers() {
    const { data } = await api.get("/users");
    return data;
  },

  async login({ username, password }) {
    const { data } = await api.get("/users", {
      params: { username, password },
    });
    return data[0] || null;
  },

  async getUser(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async createUser(payload) {
    const { data } = await api.post("/users", payload);
    return data;
  },

  async updateUser(id, payload) {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },

  async deleteUser(id) {
    await api.delete(`/users/${id}`);
    return id;
  },
};

export default userService;
