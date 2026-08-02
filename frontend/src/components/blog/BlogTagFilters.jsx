export default function BlogTagFilters({ tags, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {tags.map(tag => {
        // Handle both string tags and object tags
        const tagName = typeof tag === 'string' ? tag : tag.name;
        const tagId = typeof tag === 'string' ? tag : tag.id;
        
        return (
          <button
            key={tagId}
            onClick={() => onSelect(tagName)}
            className={`px-4 py-1 rounded-2xl font-semibold border-2 transition
              ${selected === tagName
                ? "bg-primary text-white border-primary dark:bg-blue-600 dark:border-blue-600"
                : "bg-white dark:bg-gray-700 text-primary dark:text-blue-400 border-primary dark:border-blue-400 hover:bg-secondary hover:text-white hover:border-secondary dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600"}
            `}
          >
            {tagName}
          </button>
        );
      })}
    </div>
  );
} 