export default function BlogSearchBar({ value, onChange }) {
  return (
    <div className="mb-4 flex justify-center">
      <input
        type="text"
        placeholder="Rechercher un article..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-2xl px-4 py-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
      />
    </div>
  );
} 