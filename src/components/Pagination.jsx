function Pagination({ page = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button type="button" disabled={page === 1} onClick={() => onChange?.(page - 1)}>
        Trước
      </button>
      <span>
        Trang {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange?.(page + 1)}
      >
        Sau
      </button>
    </div>
  );
}

export default Pagination;
