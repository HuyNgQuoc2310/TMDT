function CategoryMenu({ categories = [], selectedCategory = 0, onSelect }) {
  return (
    <div className="filter-rail">
      <button
        className={selectedCategory === 0 ? "active" : ""}
        type="button"
        onClick={() => onSelect?.(0)}
      >
        Tất cả
      </button>
      {categories.map((category) => (
        <button
          className={selectedCategory === category.id ? "active" : ""}
          type="button"
          onClick={() => onSelect?.(category.id)}
          key={category.id}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
