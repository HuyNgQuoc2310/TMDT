import { Link } from "react-router-dom";
import { categoryTone } from "../utils/constants";
import formatPrice from "../utils/formatPrice";
import { useCart } from "../context/CartContext";

function ProductCard({ product, category }) {
  const { addToCart } = useCart();
  const tone = categoryTone[product.categoryId] || "steel";

  return (
    <article className={`product-card tone-${tone}`}>
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} />
        <span className="stock-badge">Còn {product.stock}</span>
      </Link>

      <div className="product-card-body">
        <span className="category-pill">{category?.name || "Đồ sưu tầm"}</span>
        <Link to={`/products/${product.id}`} className="product-title">
          {product.name}
        </Link>
        <p>{product.description}</p>
        <div className="product-card-bottom">
          <strong>{formatPrice(product.price)}</strong>
          <button type="button" onClick={() => addToCart(product)}>
            Thêm
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
