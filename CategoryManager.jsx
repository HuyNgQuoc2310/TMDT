import { useEffect, useState } from "react";
import { categories as seedCategories, products as seedProducts } from "../../data/catalog";
import productService from "../../services/productService";

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoryData, productData] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(categoryData);
      setProducts(productData);
    } catch {
      setCategories(seedCategories);
      setProducts(seedProducts);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        const updatedCategory = await productService.updateCategory(editingId, { name });
        setCategories((current) =>
          current.map((category) => (category.id === editingId ? updatedCategory : category))
        );
      } else {
        const createdCategory = await productService.createCategory({ name });
        setCategories((current) => [...current, createdCategory]);
      }
      setName("");
      setEditingId(null);
    } catch {
      setError("Không thể lưu danh mục lúc này.");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
  };

  const handleDelete = async (id) => {
    if (products.some((product) => product.categoryId === id)) {
      setError("Không thể xóa danh mục đang có sản phẩm.");
      return;
    }

    try {
      await productService.deleteCategory(id);
      setCategories((current) => current.filter((category) => category.id !== id));
    } catch {
      setError("Không thể xóa danh mục lúc này.");
    }
  };

  return (
    <section className="admin-page">
      <div className="section-heading">
        <span className="eyebrow">Danh mục</span>
        <h1>Quản lý danh mục</h1>
      </div>

      <form className="admin-form compact" onSubmit={handleSubmit}>
        {error && <p className="form-note">{error}</p>}
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Tên danh mục"
          required
        />
        <button className="solid-button" type="submit">
          {editingId ? "Cập nhật" : "Thêm danh mục"}
        </button>
        {editingId && (
          <button className="ghost-button" type="button" onClick={() => setEditingId(null)}>
            Hủy
          </button>
        )}
      </form>

      <div className="category-grid">
        {categories.map((category) => (
          <article className={`category-tile category-${category.id}`} key={category.id}>
            <span>0{category.id}</span>
            <strong>{category.name}</strong>
            <small>
              {products.filter((product) => product.categoryId === category.id).length} sản phẩm
            </small>
            <div className="table-actions">
              <button type="button" onClick={() => handleEdit(category)}>
                Sửa
              </button>
              <button type="button" onClick={() => handleDelete(category.id)}>
                Xóa
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CategoryManager;
