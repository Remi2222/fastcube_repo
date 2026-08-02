export default function BlogPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 my-4">
      <button
        className="px-3 py-1 rounded-2xl border bg-white dark:bg-gray-700 shadow hover:bg-secondary hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition text-gray-700 dark:text-gray-300"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Précédent
      </button>
      <span className="px-4 py-1 font-semibold text-primary dark:text-blue-400">
        Page {page} / {totalPages}
      </span>
      <button
        className="px-3 py-1 rounded-2xl border bg-white dark:bg-gray-700 shadow hover:bg-secondary hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition text-gray-700 dark:text-gray-300"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Suivant
      </button>
    </div>
  );
} 