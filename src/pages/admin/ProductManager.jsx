import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/Pagination";
import { categories as seedCategories, products as seedProducts } from "../../data/catalog";
import productService from "../../services/productService";
import formatPrice from "../../utils/formatPrice";

const PAGE_SIZE = 10;

const emptyProduct = {
  name: "",
  price: "",
  stock: "",
  categoryId: "",
  image: "",
  description: "",
  isFeatured: false,
};

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productData, categoryData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(productData);
      setCategories(categoryData);
    } catch {
      setProducts(seedProducts);
      setCategories(seedCategories);
    }
  };

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const pagedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      image: product.image,
      description: product.description,
      isFeatured: Boolean(product.isFeatured),
    });
  };

  const normalizeFeatured = (currentProducts, featuredProductId) =>
    currentProducts.map((product) => ({
      ...product,
      isFeatured: product.id === featuredProductId,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId || categories[0]?.id),
      isFeatured: Boolean(form.isFeatured),
    };

    try {
      if (editingId) {
        const updatedProduct = await productService.updateProduct(editingId, payload);
        if (payload.isFeatured) {
          await Promise.all(
            products
              .filter((product) => product.id !== editingId && product.isFeatured)
              .map((product) => productService.updateProduct(product.id, { isFeatured: false }))
          );
        }
        setProducts((current) => {
          const nextProducts = current.map((product) =>
            product.id === editingId ? updatedProduct : product
          );
          return payload.isFeatured ? normalizeFeatured(nextProducts, editingId) : nextProducts;
        });
      } else {
        const createdProduct = await productService.createProduct(payload);
        if (payload.isFeatured) {
          await Promise.all(
            products
              .filter((product) => product.isFeatured)
              .map((product) => productService.updateProduct(product.id, { isFeatured: false }))
          );
        }
        setProducts((current) => {
          const nextProducts = [...current, createdProduct];
          return payload.isFeatured ? normalizeFeatured(nextProducts, createdProduct.id) : nextProducts;
        });
      }
      resetForm();
    } catch {
      setError("Không thể lưu sản phẩm lúc này.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      setPage(1);
    } catch {
      setError("Không thể xóa sản phẩm lúc này.");
    }
  };

  return (
    <section className="admin-page">
      <div className="section-heading">
        <span className="eyebrow">Kho hàng</span>
        <h1>Quản lý sản phẩm</h1>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <p className="form-note">{error}</p>}
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên sản phẩm" required />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Giá" required />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Tồn kho" required />
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input name="image" value={form.image} onChange={handleChange} placeholder="URL ảnh" required />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mô tả ngắn"
          required
        />
        <label className="checkbox-field">
          <input
            name="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleChange}
          />
          Đặt làm sản phẩm nổi bật
        </label>
        <div className="admin-form-actions">
          <button className="solid-button" type="submit">
            {editingId ? "Cập nhật" : "Thêm sản phẩm"}
          </button>
          {editingId && (
            <button className="ghost-button" type="button" onClick={resetForm}>
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Nổi bật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pagedProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="table-product">
                    <img src={product.image} alt={product.name} />
                    <strong>{product.name}</strong>
                  </div>
                </td>
                <td>{categoryById.get(product.categoryId)?.name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
                <td>{product.isFeatured ? <span className="status-pill">Đang chọn</span> : ""}</td>
                <td>
                  <div className="table-actions">
                    <button type="button" onClick={() => handleEdit(product)}>
                      Sửa
                    </button>
                    <button type="button" onClick={() => handleDelete(product.id)}>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}

export default ProductManager;
