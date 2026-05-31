import api from "./api";

export const feedbackService = {
  async getFeedbacks() {
    const { data } = await api.get("/feedbacks");
    return data;
  },

  async createFeedback(payload) {
    const { data } = await api.post("/feedbacks", payload);
    return data;
  },

  async deleteFeedback(id) {
    await api.delete(`/feedbacks/${id}`);
    return id;
  },
};

export default feedbackService;
