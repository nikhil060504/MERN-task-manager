import React from "react";

const Pagination = ({ page, pages, setPage }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-4">
      {page > 1 && (
        <button onClick={() => setPage(page - 1)} className="px-3 py-1 bg-gray-200 rounded">
          Prev
        </button>
      )}

      {pageNumbers.map(p => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-1 rounded ${p === page ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          {p}
        </button>
      ))}

      {page < pages && (
        <button onClick={() => setPage(page + 1)} className="px-3 py-1 bg-gray-200 rounded">
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;


