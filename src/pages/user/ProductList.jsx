import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useCatalog } from "../../hooks/useCatalog";

function ProductList() {
  const { products, categories, categoryById } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const selectedCategory = Number(params.get("category") || 0);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextProducts = products
      .filter((product) =>
        selectedCategory ? product.categoryId === selectedCategory : true
      )
      .filter((product) =>
        normalizedQuery
          ? `${product.name} ${product.description}`.toLowerCase().includes(normalizedQuery)
          : true
      );

    if (sort === "price-asc") {
      return [...nextProducts].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-desc") {
      return [...nextProducts].sort((a, b) => b.price - a.price);
    }
    if (sort === "stock") {
      return [...nextProducts].sort((a, b) => b.stock - a.stock);
    }
    return nextProducts;
  }, [products, query, selectedCategory, sort]);

  const setCategory = (categoryId) => {
    if (categoryId) {
      setParams({ category: String(categoryId) });
    } else {
      setParams({});
    }
  };

  return (
    <section className="catalog-page">
      <div className="catalog-hero">
        <span className="eyebrow">Danh sách sản phẩm</span>
        <h1>Tìm món phù hợp cho bộ sưu tập của bạn.</h1>
        <p>
          Lọc theo danh mục, tìm theo tên và sắp xếp theo giá hoặc tồn kho.
          Giao diện giữ thông tin quan trọng ở ngay trên thẻ sản phẩm.
        </p>
      </div>

      <div className="catalog-tools">
        <label className="search-field">
          <span>Tìm kiếm</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Gundam, Pikachu, Ferrari..."
          />
        </label>

        <label className="select-field">
          <span>Sắp xếp</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Mặc định</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="stock">Còn hàng nhiều nhất</option>
          </select>
        </label>
      </div>

      <div className="filter-rail">
        <button
          className={selectedCategory === 0 ? "active" : ""}
          type="button"
          onClick={() => setCategory(0)}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            className={selectedCategory === category.id ? "active" : ""}
            type="button"
            onClick={() => setCategory(category.id)}
            key={category.id}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            product={product}
            category={categoryById.get(product.categoryId)}
            key={product.id}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <strong>Không tìm thấy sản phẩm</strong>
          <p>Hãy thử từ khóa khác hoặc bỏ lọc danh mục.</p>
        </div>
      )}
    </section>
  );
}

export default ProductList;
