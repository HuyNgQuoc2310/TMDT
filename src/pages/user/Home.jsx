import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useCatalog } from "../../hooks/useCatalog";
import formatPrice from "../../utils/formatPrice";

function Home() {
  const { products, categories, categoryById } = useCatalog();
  const heroProduct = products.find((product) => product.isFeatured) || products[0];
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 4);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const averagePrice =
    products.reduce((sum, product) => sum + product.price, 0) / products.length;

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Bộ sưu tập mới / Có sẵn tại shop</span>
          <h1>Góc trưng bày đẹp bắt đầu từ một món thật đáng chọn.</h1>
          <p>
            Từ figure anime, Gundam, LEGO Technic đến Pokemon, mỗi sản phẩm đều
            được trình bày rõ giá, tồn kho và mô tả để bạn chọn nhanh hơn.
          </p>
          <div className="hero-actions">
            <Link className="solid-button" to="/products">
              Xem sản phẩm
            </Link>
            <a className="ghost-button" href="#featured">
              Sản phẩm nổi bật
            </a>
          </div>
        </div>

        <div className="hero-showcase">
          <div className="showcase-frame">
            {heroProduct && <img src={heroProduct.image} alt={heroProduct.name} />}
            <div>
              <span>Gợi ý hôm nay</span>
              <strong>{heroProduct?.name}</strong>
              <small>{heroProduct && formatPrice(heroProduct.price)}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-strip" aria-label="Thống kê cửa hàng">
        <div>
          <strong>{products.length}</strong>
          <span>Sản phẩm chọn lọc</span>
        </div>
        <div>
          <strong>{totalStock}</strong>
          <span>Số lượng sẵn hàng</span>
        </div>
        <div>
          <strong>{formatPrice(Number.isNaN(averagePrice) ? 0 : averagePrice)}</strong>
          <span>Giá trung bình</span>
        </div>
      </section>

      <section className="category-band">
        <div className="section-heading">
          <span className="eyebrow">Danh mục</span>
          <h2>Chọn theo dòng sản phẩm bạn thích</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className={`category-tile category-${category.id}`}
              to={`/products?category=${category.id}`}
              key={category.id}
            >
              <span>0{category.id}</span>
              <strong>{category.name}</strong>
              <small>
                {products.filter((product) => product.categoryId === category.id).length} sản phẩm
              </small>
            </Link>
          ))}
        </div>
      </section>

      <section className="catalog-section" id="featured">
        <div className="section-heading row-heading">
          <div>
            <span className="eyebrow">Nổi bật</span>
            <h2>Những món dễ làm sáng kệ trưng bày</h2>
          </div>
          <Link to="/products">Xem tất cả</Link>
        </div>
        <div className="product-grid">
          {displayProducts.map((product) => (
            <ProductCard
              product={product}
              category={categoryById.get(product.categoryId)}
              key={product.id}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
