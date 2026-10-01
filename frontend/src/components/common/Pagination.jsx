import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ page, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong> results
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <span className="pagination-page-indicator">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          className="btn-secondary btn-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
