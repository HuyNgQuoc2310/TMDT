function FeedbackCard({ feedback, productName = "Sản phẩm", userName }) {
  return (
    <article className="review-card">
      <strong>{productName}</strong>
      <span>{"★".repeat(feedback.rating)}</span>
      <p>{feedback.comment}</p>
      {userName && <small>{userName}</small>}
    </article>
  );
}

export default FeedbackCard;
