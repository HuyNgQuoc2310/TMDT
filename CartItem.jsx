import formatPrice from "../utils/formatPrice";

function CartItem({ item, onQuantityChange, onRemove }) {
  const { product, quantity } = item;

  return (
    <article className="cart-row">
      <img src={product.image} alt={product.name} />
      <div>
        <strong>{product.name}</strong>
        <span>{formatPrice(product.price)}</span>
      </div>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(event) => onQuantityChange?.(product.id, Number(event.target.value))}
      />
      <button type="button" onClick={() => onRemove?.(product.id)}>
        Xóa
      </button>
    </article>
  );
}

export default CartItem;
