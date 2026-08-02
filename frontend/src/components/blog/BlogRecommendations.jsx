export default function BlogRecommendations({ posts }) {
  if (!posts || posts.length === 0) return null;
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-primary dark:text-blue-400 mb-4">Articles recommandés</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-secondary/10 dark:bg-gray-700 rounded-xl p-4">
            <a href={`/blog/${post.id}`} className="font-semibold text-primary dark:text-blue-400 hover:underline">{post.title}</a>
            <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 