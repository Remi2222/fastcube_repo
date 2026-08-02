export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold text-primary mb-4 page-title">{title}</h2>
      <p className="text-secondary dark:text-gray-300 mb-6">{subtitle}</p>
    </div>
  );
} 