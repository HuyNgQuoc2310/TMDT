import api from "./api";

export const wishlistService = {
  async getWishlists(userId) {
    const { data } = await api.get("/wishlists", {
      params: userId ? { userId } : undefined,
    });
    return data;
  },

  async addWishlist(payload) {
    const { data } = await api.post("/wishlists", payload);
    return data;
  },

  async removeWishlist(id) {
    await api.delete(`/wishlists/${id}`);
    return id;
  },
};

export default wishlistService;
