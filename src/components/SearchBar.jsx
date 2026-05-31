function SearchBar({ value, onChange, placeholder = "Tìm kiếm sản phẩm..." }) {
  return (
    <label className="search-field">
      <span>Tìm kiếm</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export default SearchBar;
