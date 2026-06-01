import api from "./api";

export const productService = {
  async getProducts() {
    const { data } = await api.get("/products");
    return data;
  },

  async getCategories() {
    const { data } = await api.get("/categories");
    return data;
  },

  async getProduct(id) {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  async createProduct(payload) {
    const { data } = await api.post("/products", payload);
    return data;
  },

  async updateProduct(id, payload) {
    const { data } = await api.patch(`/products/${id}`, payload);
    return data;
  },

  async deleteProduct(id) {
    await api.delete(`/products/${id}`);
    return id;
  },

  async createCategory(payload) {
    const { data } = await api.post("/categories", payload);
    return data;
  },

  async updateCategory(id, payload) {
    const { data } = await api.patch(`/categories/${id}`, payload);
    return data;
  },

  async deleteCategory(id) {
    await api.delete(`/categories/${id}`);
    return id;
  },
};

export default productService;
